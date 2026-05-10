'use strict';
/**
 * api/index.js — Pure serverless handler for Vercel
 * Exports: module.exports = async function handler(req, res)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Busboy = require('busboy');

// ─── Prisma singleton (prevents connection explosion in serverless) ───────────
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

// ─── Cloudinary delete helper ─────────────────────────────────────────────────
/**
 * Hapus gambar dari Cloudinary berdasarkan URL atau public_id.
 * Tidak throw error jika gagal — silent fail agar delete record tetap jalan.
 */
async function deleteCloudinaryImage(urlOrPublicId) {
  if (!urlOrPublicId || !process.env.CLOUDINARY_API_KEY) return;
  try {
    let publicId = urlOrPublicId;
    // Jika berupa URL Cloudinary, ekstrak public_id
    if (urlOrPublicId.startsWith('http')) {
      // Format: https://res.cloudinary.com/{cloud}/image/upload/v{ver}/{folder}/{id}.{ext}
      const match = urlOrPublicId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
      if (match) publicId = match[1];
      else return; // bukan URL Cloudinary yang valid
    }
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Silent fail — jangan block delete record
  }
}

/**
 * Hapus array gambar dari Cloudinary (untuk field images JSON array).
 */
async function deleteCloudinaryImages(imagesJson) {
  if (!imagesJson) return;
  try {
    const urls = JSON.parse(imagesJson);
    await Promise.all(urls.map(deleteCloudinaryImage));
  } catch {
    // Silent fail
  }
}

// ─── CORS ────────────────────────────────────────────────────────────────────
function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed =
    !origin ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.endsWith('.vercel.app') ||
    (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);

  res.setHeader('Access-Control-Allow-Origin', allowed ? (origin || '*') : '');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept');
}

// ─── Auth ───────────────────────────────────────────────────────────────────── 
function verifyToken(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { return jwt.verify(h.slice(7), JWT_SECRET); }
  catch { return null; }
}

function requireAuth(req, res) {
  const admin = verifyToken(req);
  if (!admin) { res.status(401).json({ error: 'Unauthorized' }); return null; }
  return admin;
}

// ─── Body parser ─────────────────────────────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch { resolve({}); }
    });
  });
}

// ─── Multipart upload ─────────────────────────────────────────────────────────
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

// ─── Route matcher ────────────────────────────────────────────────────────────
function matchRoute(pattern, pathname) {
  const pp = pattern.split('/');
  const up = pathname.split('/');
  if (pp.length !== up.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(up[i]);
    else if (pp[i] !== up[i]) return null;
  }
  return params;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();
  let matched = false;

  const route = (m, pattern, fn) => {
    if (matched) return;
    if (m !== method) return;
    const params = matchRoute(pattern, pathname);
    if (params === null) return;
    matched = true;
    req.params = params;
    req.query = Object.fromEntries(url.searchParams);
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error('[handler error]', err.message);
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
  };

  // ── HEALTH ────────────────────────────────────────────────────────────────
  route('GET', '/api/health', async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'connected' });
  });

  // ── AUTH ──────────────────────────────────────────────────────────────────
  route('POST', '/api/auth/login', async (req, res) => {
    const { username, password } = await parseBody(req);
    if (!username || !password)
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ error: 'Username atau password salah' });
    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET, { expiresIn: '24h' }
    );
    res.json({ token, admin: { id: admin.id, username: admin.username, name: admin.name } });
  });

  route('GET', '/api/auth/me', async (req, res) => {
    const admin = requireAuth(req, res); if (!admin) return;
    const data = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: { id: true, username: true, name: true, createdAt: true },
    });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  });

  route('POST', '/api/auth/setup', async (req, res) => {
    if (await prisma.admin.count() > 0)
      return res.status(403).json({ error: 'Admin sudah ada.' });
    const { username, password, name } = await parseBody(req);
    if (!username || !password)
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    const hashed = await bcrypt.hash(password, 12);
    const a = await prisma.admin.create({ data: { username, password: hashed, name: name || 'Administrator' } });
    res.status(201).json({ message: 'Admin berhasil dibuat', id: a.id, username: a.username });
  });

  // ── HERO ──────────────────────────────────────────────────────────────────
  route('GET', '/api/hero', async (_req, res) => {
    res.json(await prisma.hero.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/hero/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.hero.findMany({ orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/hero/:id', async (req, res) => {
    const h = await prisma.hero.findUnique({ where: { id: req.params.id } });
    h ? res.json(h) : res.status(404).json({ error: 'Not found' });
  });
  route('POST', '/api/hero', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.hero.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/hero/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.hero.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/hero/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const h = await prisma.hero.findUnique({ where: { id: req.params.id } });
    if (h?.bgImage) await deleteCloudinaryImage(h.bgImage);
    await prisma.hero.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  route('GET', '/api/about', async (_req, res) => {
    res.json(await prisma.about.findFirst({ where: { active: true } }));
  });
  route('PUT', '/api/about', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.about.findFirst();
    res.json(ex
      ? await prisma.about.update({ where: { id: ex.id }, data: body })
      : await prisma.about.create({ data: body }));
  });

  // ── STATS ─────────────────────────────────────────────────────────────────
  route('GET', '/api/stats', async (req, res) => {
    const where = { active: true };
    if (req.query.section) where.section = req.query.section;
    res.json(await prisma.stats.findMany({ where, orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/stats/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.stats.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] }));
  });
  route('POST', '/api/stats', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.stats.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/stats/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.stats.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/stats/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.stats.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── ANGKATAN ──────────────────────────────────────────────────────────────
  route('GET', '/api/angkatan', async (_req, res) => {
    res.json(await prisma.angkatan.findMany({
      where: { active: true }, orderBy: { order: 'asc' },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    }));
  });
  route('GET', '/api/angkatan/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.angkatan.findMany({
      orderBy: { order: 'asc' },
      include: { members: { orderBy: { order: 'asc' } } },
    }));
  });
  route('GET', '/api/angkatan/:id', async (req, res) => {
    const a = await prisma.angkatan.findUnique({
      where: { id: req.params.id },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    });
    a ? res.json(a) : res.status(404).json({ error: 'Not found' });
  });
  route('POST', '/api/angkatan', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { members: _, ...data } = await parseBody(req);
    res.status(201).json(await prisma.angkatan.create({ data }));
  });
  route('PUT', '/api/angkatan/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { members: _, ...data } = await parseBody(req);
    res.json(await prisma.angkatan.update({ where: { id: req.params.id }, data }));
  });
  route('DELETE', '/api/angkatan/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const a = await prisma.angkatan.findUnique({ where: { id: req.params.id } });
    if (a?.image) await deleteCloudinaryImage(a.image);
    await prisma.angkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── ANGGOTA ───────────────────────────────────────────────────────────────
  route('GET', '/api/angkatan/:angkatanId/members', async (req, res) => {
    res.json(await prisma.anggotaAngkatan.findMany({
      where: { angkatanId: req.params.angkatanId, active: true },
      orderBy: { order: 'asc' },
    }));
  });
  route('POST', '/api/angkatan/:angkatanId/members', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.anggotaAngkatan.create({
      data: { ...await parseBody(req), angkatanId: req.params.angkatanId },
    }));
  });
  route('PUT', '/api/members/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.anggotaAngkatan.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/members/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const m = await prisma.anggotaAngkatan.findUnique({ where: { id: req.params.id } });
    if (m?.image) await deleteCloudinaryImage(m.image);
    await prisma.anggotaAngkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── STRUKTUR ──────────────────────────────────────────────────────────────
  route('GET', '/api/struktur', async (_req, res) => {
    res.json(await prisma.struktur.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/struktur/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.struktur.findMany({ orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/struktur/:id', async (req, res) => {
    const s = await prisma.struktur.findUnique({ where: { id: req.params.id } });
    s ? res.json(s) : res.status(404).json({ error: 'Not found' });
  });
  route('POST', '/api/struktur', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.struktur.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/struktur/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.struktur.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/struktur/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.struktur.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── PURNA ─────────────────────────────────────────────────────────────────
  route('GET', '/api/purna', async (_req, res) => {
    res.json(await prisma.purna.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/purna/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.purna.findMany({ orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/purna/:id', async (req, res) => {
    const p = await prisma.purna.findUnique({ where: { id: req.params.id } });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  });
  route('POST', '/api/purna', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.purna.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/purna/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.purna.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/purna/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const p = await prisma.purna.findUnique({ where: { id: req.params.id } });
    if (p?.profile) await deleteCloudinaryImage(p.profile);
    await prisma.purna.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── PROGRAM ───────────────────────────────────────────────────────────────
  route('GET', '/api/program', async (_req, res) => {
    res.json(await prisma.program.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/program/all', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.program.findMany({ orderBy: { order: 'asc' } }));
  });
  route('GET', '/api/program/:id', async (req, res) => {
    const p = await prisma.program.findUnique({ where: { id: req.params.id } });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  });
  route('POST', '/api/program', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.program.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/program/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.program.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/program/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const p = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (p?.images) await deleteCloudinaryImages(p.images);
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── CTA ───────────────────────────────────────────────────────────────────
  route('GET', '/api/cta', async (_req, res) => {
    res.json(await prisma.cta.findFirst({ where: { active: true } }));
  });
  route('PUT', '/api/cta', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.cta.findFirst();
    res.json(ex
      ? await prisma.cta.update({ where: { id: ex.id }, data: body })
      : await prisma.cta.create({ data: body }));
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  route('GET', '/api/footer', async (_req, res) => {
    res.json(await prisma.footer.findFirst({ where: { active: true } }));
  });
  route('PUT', '/api/footer', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.footer.findFirst();
    res.json(ex
      ? await prisma.footer.update({ where: { id: ex.id }, data: body })
      : await prisma.footer.create({ data: body }));
  });

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  route('GET', '/api/settings', async (_req, res) => {
    res.json(await prisma.siteSettings.findFirst() || {});
  });
  route('PUT', '/api/settings', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const ex = await prisma.siteSettings.findFirst();
    res.json(ex
      ? await prisma.siteSettings.update({ where: { id: ex.id }, data: body })
      : await prisma.siteSettings.create({ data: body }));
  });

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  route('GET', '/api/navigation', async (_req, res) => {
    res.json(await prisma.navigation.findMany({ where: { active: true }, orderBy: { order: 'asc' } }));
  });
  route('POST', '/api/navigation', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.status(201).json(await prisma.navigation.create({ data: await parseBody(req) }));
  });
  route('PUT', '/api/navigation/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    res.json(await prisma.navigation.update({ where: { id: req.params.id }, data: await parseBody(req) }));
  });
  route('DELETE', '/api/navigation/:id', async (req, res) => {
    if (!requireAuth(req, res)) return;
    await prisma.navigation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  });

  // ── DELETE MEDIA (hapus gambar dari Cloudinary) ───────────────────────────
  route('DELETE', '/api/media', async (req, res) => {
    if (!requireAuth(req, res)) return;
    const body = await parseBody(req);
    const { url } = body;
    if (!url) return res.status(400).json({ error: 'url wajib diisi' });
    await deleteCloudinaryImage(url);
    res.json({ message: 'Media deleted from Cloudinary' });
  });

  // ── UPLOAD ────────────────────────────────────────────────────────────────
  route('POST', '/api/upload', async (req, res) => {
    if (!requireAuth(req, res)) return;
    if (!process.env.CLOUDINARY_API_KEY)
      return res.status(500).json({ error: 'Cloudinary not configured' });

    const folder = req.query.folder || 'general';
    const safe = ['members','angkatan','program','purna','general'].includes(folder) ? folder : 'general';
    const { files } = await parseMultipart(req);
    if (!files.length) return res.status(400).json({ error: 'No file uploaded' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `tunakarya/${safe}`, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (err, r) => err ? reject(err) : resolve(r)
      );
      stream.end(files[0].buffer);
    });

    res.json({ message: 'Uploaded', url: result.secure_url, filename: result.public_id, size: result.bytes });
  });

  // ── 404 ───────────────────────────────────────────────────────────────────
  if (!matched) {
    res.status(404).json({ error: `Cannot ${method} ${pathname}` });
  }
};
