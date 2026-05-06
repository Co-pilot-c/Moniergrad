'use strict';
/**
 * api/index.js — Pure serverless handler (no Express, no app.listen)
 * Vercel calls: export default handler(req, res)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Busboy = require('busboy');

// ─── Prisma singleton ────────────────────────────────────────────────────────
const g = globalThis;
if (!g._prisma) {
  g._prisma = new PrismaClient({ log: ['error'] });
}
const prisma = g._prisma;

// ─── Config ──────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'tunakarya-cms-secret-2024';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── CORS helper ─────────────────────────────────────────────────────────────
function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed =
    !origin ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.endsWith('.vercel.app') ||
    (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);

  if (allowed) res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept');
}

// ─── Auth helper ─────────────────────────────────────────────────────────────
function verifyToken(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(h.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuth(req, res) {
  const admin = verifyToken(req);
  if (!admin) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return admin;
}

// ─── Body parser ─────────────────────────────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body); // already parsed by Vercel
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch { resolve({}); }
    });
  });
}

// ─── Multipart / file upload helper ──────────────────────────────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    const fields = {};
    const files = [];
    bb.on('field', (name, val) => { fields[name] = val; });
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', (c) => chunks.push(c));
      stream.on('end', () => files.push({ name, buffer: Buffer.concat(chunks), info }));
    });
    bb.on('finish', () => resolve({ fields, files }));
    bb.on('error', reject);
    req.pipe(bb);
  });
}

// ─── JSON response helpers ────────────────────────────────────────────────────
function json(res, data, status = 200) {
  res.status(status).json(data);
}

// ─── Route matcher ────────────────────────────────────────────────────────────
// Returns { params } if pattern matches, null otherwise.
// Pattern: '/api/angkatan/:id/members' etc.
function matchRoute(pattern, pathname) {
  const patParts = pattern.split('/');
  const urlParts = pathname.split('/');
  if (patParts.length !== urlParts.length) return null;
  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = decodeURIComponent(urlParts[i]);
    } else if (patParts[i] !== urlParts[i]) {
      return null;
    }
  }
  return params;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();

  // ── Helper to match and run ──────────────────────────────────────────────
  let matched = false;

  const route = (m, pattern, fn) => {
    if (matched) return;
    if (m !== method && m !== 'ALL') return;
    const params = matchRoute(pattern, pathname);
    if (params === null) return;
    matched = true;
    req.params = params;
    req.query = Object.fromEntries(url.searchParams);
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error(err);
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
  };

  // ── HEALTH ────────────────────────────────────────────────────────────────
  route('GET', '/api/health', async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    json(res, { status: 'OK', timestamp: new Date().toISOString(), database: 'connected' });
  });

  // ── AUTH ──────────────────────────────────────────────────────────────────
  route('POST', '/api/auth/login', async (req, res) => {
    const { username, password } = await parseBody(req);
    if (!username || !password)
      return json(res, { error: 'Username dan password wajib diisi' }, 400);

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return json(res, { error: 'Username atau password salah' }, 401);

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    json(res, { token, admin: { id: admin.id, username: admin.username, name: admin.name } });
  });

  route('GET', '/api/auth/me', async (req, res) => {
    const admin = requireAuth(req, res);
    if (!admin) return;
    const data = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: { id: true, username: true, name: true, createdAt: true },
    });
    if (!data) return json(res, { error: 'Not found' }, 404);
    json(res, data);
  });

  route('POST', '/api/auth/setup', async (req, res) => {
    const count = await prisma.admin.count();
    if (count > 0) return json(res, { error: 'Admin sudah ada.' }, 403);
    const { username, password, name } = await parseBody(req);
    if (!username || !password) return json(res, { error: 'Username dan password wajib diisi' }, 400);
    const hashed = await bcrypt.hash(password, 12);
    const a = await prisma.admin.create({ data: { username, password: hashed, name: name || 'Administrator' } });
    json(res, { message: 'Admin berhasil dibuat', id: a.id, username: a.username }, 201);
  });

  // ── HERO ──────────────────────────────────────────────────────────────────
  route('GET', '/api/hero', async (_req, res) => {
    json(res, await prisma.hero.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/hero/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.hero.findMany({ orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/hero/:id', async (req, res) => {
    const h = await prisma.hero.findUnique({ where: { id: req.params.id } });
    if (!h) return json(res, { error: 'Not found' }, 404);
    json(res, h);
  });

  route('POST', '/api/hero', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.hero.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/hero/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.hero.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/hero/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.hero.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  route('GET', '/api/about', async (_req, res) => {
    json(res, await prisma.about.findFirst({ where: { active: true } }));
  });

  route('PUT', '/api/about', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.about.findFirst();
    json(res, ex
      ? await prisma.about.update({ where: { id: ex.id }, data: body })
      : await prisma.about.create({ data: body }));
  });

  // ── STATS ─────────────────────────────────────────────────────────────────
  route('GET', '/api/stats', async (req, res) => {
    const where = { active: true };
    if (req.query.section) where.section = req.query.section;
    json(res, await prisma.stats.findMany({ where, orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/stats/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.stats.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] }));
  });

  route('POST', '/api/stats', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.stats.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/stats/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.stats.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/stats/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.stats.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── ANGKATAN ──────────────────────────────────────────────────────────────
  route('GET', '/api/angkatan', async (_req, res) => {
    json(res, await prisma.angkatan.findMany({
      where: { active: true }, orderBy: { order: 'asc' },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    }));
  });

  route('GET', '/api/angkatan/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.angkatan.findMany({
      orderBy: { order: 'asc' },
      include: { members: { orderBy: { order: 'asc' } } },
    }));
  });

  route('GET', '/api/angkatan/:id', async (req, res) => {
    const a = await prisma.angkatan.findUnique({
      where: { id: req.params.id },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    });
    if (!a) return json(res, { error: 'Not found' }, 404);
    json(res, a);
  });

  route('POST', '/api/angkatan', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { members: _, ...data } = await parseBody(req);
    json(res, await prisma.angkatan.create({ data }), 201);
  });

  route('PUT', '/api/angkatan/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { members: _, ...data } = await parseBody(req);
    json(res, await prisma.angkatan.update({ where: { id: req.params.id }, data }));
  });

  route('DELETE', '/api/angkatan/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.angkatan.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── ANGGOTA ───────────────────────────────────────────────────────────────
  route('GET', '/api/angkatan/:angkatanId/members', async (req, res) => {
    json(res, await prisma.anggotaAngkatan.findMany({
      where: { angkatanId: req.params.angkatanId, active: true },
      orderBy: { order: 'asc' },
    }));
  });

  route('POST', '/api/angkatan/:angkatanId/members', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.anggotaAngkatan.create({
      data: { ...await parseBody(req), angkatanId: req.params.angkatanId },
    }), 201);
  });

  route('PUT', '/api/members/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.anggotaAngkatan.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/members/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.anggotaAngkatan.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── STRUKTUR ──────────────────────────────────────────────────────────────
  route('GET', '/api/struktur', async (_req, res) => {
    json(res, await prisma.struktur.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/struktur/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.struktur.findMany({ orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/struktur/:id', async (req, res) => {
    const s = await prisma.struktur.findUnique({ where: { id: req.params.id } });
    if (!s) return json(res, { error: 'Not found' }, 404);
    json(res, s);
  });

  route('POST', '/api/struktur', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.struktur.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/struktur/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.struktur.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/struktur/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.struktur.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── PURNA ─────────────────────────────────────────────────────────────────
  route('GET', '/api/purna', async (_req, res) => {
    json(res, await prisma.purna.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/purna/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.purna.findMany({ orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/purna/:id', async (req, res) => {
    const p = await prisma.purna.findUnique({ where: { id: req.params.id } });
    if (!p) return json(res, { error: 'Not found' }, 404);
    json(res, p);
  });

  route('POST', '/api/purna', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.purna.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/purna/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.purna.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/purna/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.purna.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── PROGRAM ───────────────────────────────────────────────────────────────
  route('GET', '/api/program', async (_req, res) => {
    json(res, await prisma.program.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/program/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.program.findMany({ orderBy: { order: 'asc' } }));
  });

  route('GET', '/api/program/:id', async (req, res) => {
    const p = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!p) return json(res, { error: 'Not found' }, 404);
    json(res, p);
  });

  route('POST', '/api/program', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.program.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/program/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.program.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/program/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.program.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── CTA ───────────────────────────────────────────────────────────────────
  route('GET', '/api/cta', async (_req, res) => {
    json(res, await prisma.cta.findFirst({ where: { active: true } }));
  });

  route('PUT', '/api/cta', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.cta.findFirst();
    json(res, ex
      ? await prisma.cta.update({ where: { id: ex.id }, data: body })
      : await prisma.cta.create({ data: body }));
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  route('GET', '/api/footer', async (_req, res) => {
    json(res, await prisma.footer.findFirst({ where: { active: true } }));
  });

  route('PUT', '/api/footer', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.footer.findFirst();
    json(res, ex
      ? await prisma.footer.update({ where: { id: ex.id }, data: body })
      : await prisma.footer.create({ data: body }));
  });

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  route('GET', '/api/settings', async (_req, res) => {
    json(res, await prisma.siteSettings.findFirst() || {});
  });

  route('PUT', '/api/settings', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.siteSettings.findFirst();
    json(res, ex
      ? await prisma.siteSettings.update({ where: { id: ex.id }, data: body })
      : await prisma.siteSettings.create({ data: body }));
  });

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  route('GET', '/api/navigation', async (_req, res) => {
    json(res, await prisma.navigation.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });

  route('POST', '/api/navigation', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.navigation.create({ data: await parseBody(req) }), 201);
  });

  route('PUT', '/api/navigation/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    json(res, await prisma.navigation.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });

  route('DELETE', '/api/navigation/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.navigation.delete({ where: { id: req.params.id } });
    json(res, { message: 'Deleted' });
  });

  // ── UPLOAD ────────────────────────────────────────────────────────────────
  route('POST', '/api/upload', async (req, res) => {
    if (!requireAuth(req, res)) return;

    if (!process.env.CLOUDINARY_API_KEY) {
      return json(res, { error: 'Cloudinary not configured. Set CLOUDINARY_API_KEY env var.' }, 500);
    }

    const folder = req.query.folder || 'general';
    const allowed = ['members', 'angkatan', 'program', 'purna', 'general'];
    const safeFolder = allowed.includes(folder) ? folder : 'general';

    const { files } = await parseMultipart(req);
    if (!files.length) return json(res, { error: 'No file uploaded' }, 400);

    const file = files[0];
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `tunakarya/${safeFolder}`,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      stream.end(file.buffer);
    });

    json(res, {
      message: 'File uploaded successfully',
      url: result.secure_url,
      filename: result.public_id,
      size: result.bytes,
    });
  });

  // ── 404 ───────────────────────────────────────────────────────────────────
  if (!matched) {
    json(res, { error: `Cannot ${method} ${pathname}` }, 404);
  }
};
