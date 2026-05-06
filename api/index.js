/**
 * api/index.js  ←  Vercel Serverless Entry Point
 *
 * Arsitektur: Express-as-a-handler (bukan split per-file).
 * Alasan:
 *  - Semua route tetap berjalan persis sama seperti sebelumnya
 *  - Tidak ada risiko routing mismatch
 *  - Prisma singleton di lib/prisma.js mencegah connection explosion
 *  - Tidak ada app.listen() — Vercel inject req/res langsung
 *
 * Vercel memanggil: module.exports = app  (Express app sebagai handler)
 */

'use strict';

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ─── Shared libs ─────────────────────────────────────────────────────────────
const prisma = require('../lib/prisma');
const { corsMiddleware, authMiddleware, JWT_SECRET } = require('../lib/middleware');

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected', error: err.message });
  }
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username dan password wajib diisi' });

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin)
      return res.status(401).json({ error: 'Username atau password salah' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid)
      return res.status(401).json({ error: 'Username atau password salah' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, admin: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, username: true, name: true, createdAt: true },
    });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/setup', async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0)
      return res.status(403).json({ error: 'Admin sudah ada. Gunakan endpoint login.' });

    const { username, password, name } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username dan password wajib diisi' });

    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: { username, password: hashed, name: name || 'Administrator' },
    });
    res.status(201).json({ message: 'Admin berhasil dibuat', id: admin.id, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── HERO ─────────────────────────────────────────────────────────────────────
app.get('/api/hero', async (_req, res) => {
  try {
    const heroes = await prisma.hero.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    res.json(heroes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hero/all', authMiddleware, async (_req, res) => {
  try {
    const heroes = await prisma.hero.findMany({ orderBy: { order: 'asc' } });
    res.json(heroes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hero/:id', async (req, res) => {
  try {
    const hero = await prisma.hero.findUnique({ where: { id: req.params.id } });
    if (!hero) return res.status(404).json({ error: 'Not found' });
    res.json(hero);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/hero', authMiddleware, async (req, res) => {
  try {
    const hero = await prisma.hero.create({ data: req.body });
    res.status(201).json(hero);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/hero/:id', authMiddleware, async (req, res) => {
  try {
    const hero = await prisma.hero.update({ where: { id: req.params.id }, data: req.body });
    res.json(hero);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/hero/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.hero.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ABOUT ────────────────────────────────────────────────────────────────────
app.get('/api/about', async (_req, res) => {
  try {
    const about = await prisma.about.findFirst({ where: { active: true } });
    res.json(about || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/about', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.about.findFirst();
    const about = existing
      ? await prisma.about.update({ where: { id: existing.id }, data: req.body })
      : await prisma.about.create({ data: req.body });
    res.json(about);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── STATS ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const where = { active: true };
    if (req.query.section) where.section = req.query.section;
    const stats = await prisma.stats.findMany({ where, orderBy: { order: 'asc' } });
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/stats/all', authMiddleware, async (_req, res) => {
  try {
    const stats = await prisma.stats.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] });
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/stats', authMiddleware, async (req, res) => {
  try {
    const stat = await prisma.stats.create({ data: req.body });
    res.status(201).json(stat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/stats/:id', authMiddleware, async (req, res) => {
  try {
    const stat = await prisma.stats.update({ where: { id: req.params.id }, data: req.body });
    res.json(stat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/stats/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.stats.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ANGKATAN ─────────────────────────────────────────────────────────────────
app.get('/api/angkatan', async (_req, res) => {
  try {
    const angkatans = await prisma.angkatan.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    });
    res.json(angkatans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/angkatan/all', authMiddleware, async (_req, res) => {
  try {
    const angkatans = await prisma.angkatan.findMany({
      orderBy: { order: 'asc' },
      include: { members: { orderBy: { order: 'asc' } } },
    });
    res.json(angkatans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/angkatan/:id', async (req, res) => {
  try {
    const angkatan = await prisma.angkatan.findUnique({
      where: { id: req.params.id },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } },
    });
    if (!angkatan) return res.status(404).json({ error: 'Not found' });
    res.json(angkatan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/angkatan', authMiddleware, async (req, res) => {
  try {
    const { members: _m, ...data } = req.body;
    const angkatan = await prisma.angkatan.create({ data });
    res.status(201).json(angkatan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/angkatan/:id', authMiddleware, async (req, res) => {
  try {
    const { members: _m, ...data } = req.body;
    const angkatan = await prisma.angkatan.update({ where: { id: req.params.id }, data });
    res.json(angkatan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/angkatan/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.angkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ANGGOTA ──────────────────────────────────────────────────────────────────
app.get('/api/angkatan/:angkatanId/members', async (req, res) => {
  try {
    const members = await prisma.anggotaAngkatan.findMany({
      where: { angkatanId: req.params.angkatanId, active: true },
      orderBy: { order: 'asc' },
    });
    res.json(members);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/angkatan/:angkatanId/members', authMiddleware, async (req, res) => {
  try {
    const member = await prisma.anggotaAngkatan.create({
      data: { ...req.body, angkatanId: req.params.angkatanId },
    });
    res.status(201).json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    const member = await prisma.anggotaAngkatan.update({ where: { id: req.params.id }, data: req.body });
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.anggotaAngkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── STRUKTUR ─────────────────────────────────────────────────────────────────
app.get('/api/struktur', async (_req, res) => {
  try {
    const strukturs = await prisma.struktur.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    res.json(strukturs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/struktur/all', authMiddleware, async (_req, res) => {
  try {
    const strukturs = await prisma.struktur.findMany({ orderBy: { order: 'asc' } });
    res.json(strukturs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/struktur/:id', async (req, res) => {
  try {
    const struktur = await prisma.struktur.findUnique({ where: { id: req.params.id } });
    if (!struktur) return res.status(404).json({ error: 'Not found' });
    res.json(struktur);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/struktur', authMiddleware, async (req, res) => {
  try {
    const struktur = await prisma.struktur.create({ data: req.body });
    res.status(201).json(struktur);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/struktur/:id', authMiddleware, async (req, res) => {
  try {
    const struktur = await prisma.struktur.update({ where: { id: req.params.id }, data: req.body });
    res.json(struktur);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/struktur/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.struktur.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── PURNA ────────────────────────────────────────────────────────────────────
app.get('/api/purna', async (_req, res) => {
  try {
    const purnas = await prisma.purna.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    res.json(purnas);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/purna/all', authMiddleware, async (_req, res) => {
  try {
    const purnas = await prisma.purna.findMany({ orderBy: { order: 'asc' } });
    res.json(purnas);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/purna/:id', async (req, res) => {
  try {
    const purna = await prisma.purna.findUnique({ where: { id: req.params.id } });
    if (!purna) return res.status(404).json({ error: 'Not found' });
    res.json(purna);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/purna', authMiddleware, async (req, res) => {
  try {
    const purna = await prisma.purna.create({ data: req.body });
    res.status(201).json(purna);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/purna/:id', authMiddleware, async (req, res) => {
  try {
    const purna = await prisma.purna.update({ where: { id: req.params.id }, data: req.body });
    res.json(purna);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/purna/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.purna.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── PROGRAM ──────────────────────────────────────────────────────────────────
app.get('/api/program', async (_req, res) => {
  try {
    const programs = await prisma.program.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    res.json(programs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/program/all', authMiddleware, async (_req, res) => {
  try {
    const programs = await prisma.program.findMany({ orderBy: { order: 'asc' } });
    res.json(programs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/program/:id', async (req, res) => {
  try {
    const program = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!program) return res.status(404).json({ error: 'Not found' });
    res.json(program);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/program', authMiddleware, async (req, res) => {
  try {
    const program = await prisma.program.create({ data: req.body });
    res.status(201).json(program);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/program/:id', authMiddleware, async (req, res) => {
  try {
    const program = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
    res.json(program);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/program/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── CTA ──────────────────────────────────────────────────────────────────────
app.get('/api/cta', async (_req, res) => {
  try {
    const cta = await prisma.cta.findFirst({ where: { active: true } });
    res.json(cta || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/cta', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.cta.findFirst();
    const cta = existing
      ? await prisma.cta.update({ where: { id: existing.id }, data: req.body })
      : await prisma.cta.create({ data: req.body });
    res.json(cta);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── FOOTER ───────────────────────────────────────────────────────────────────
app.get('/api/footer', async (_req, res) => {
  try {
    const footer = await prisma.footer.findFirst({ where: { active: true } });
    res.json(footer || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/footer', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.footer.findFirst();
    const footer = existing
      ? await prisma.footer.update({ where: { id: existing.id }, data: req.body })
      : await prisma.footer.create({ data: req.body });
    res.json(footer);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.siteSettings.findFirst();
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data: req.body })
      : await prisma.siteSettings.create({ data: req.body });
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
app.get('/api/navigation', async (_req, res) => {
  try {
    const navs = await prisma.navigation.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    res.json(navs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/navigation', authMiddleware, async (req, res) => {
  try {
    const nav = await prisma.navigation.create({ data: req.body });
    res.status(201).json(nav);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/navigation/:id', authMiddleware, async (req, res) => {
  try {
    const nav = await prisma.navigation.update({ where: { id: req.params.id }, data: req.body });
    res.json(nav);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/navigation/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.navigation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── FILE UPLOAD (Cloudinary) ─────────────────────────────────────────────────
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasCloudinary = !!(process.env.CLOUDINARY_API_KEY);

// Di Vercel, disk storage tidak persistent — selalu pakai Cloudinary di production.
// Fallback memory storage untuk dev tanpa Cloudinary.
let upload;
if (hasCloudinary) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req) => ({
      folder: `tunakarya/${req.query.folder || 'general'}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }),
  });
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
} else {
  // Dev fallback: simpan ke memory, return data URL (tidak untuk production)
  upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    let fileUrl;

    if (hasCloudinary) {
      // Cloudinary: path sudah berupa secure_url
      fileUrl = req.file.path;
    } else {
      // Dev: upload buffer langsung ke Cloudinary via stream, atau return placeholder
      if (req.file.buffer) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `tunakarya/${req.query.folder || 'general'}` },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          stream.end(req.file.buffer);
        });
        fileUrl = result.secure_url;
      } else {
        return res.status(500).json({ error: 'Cloudinary not configured. Set CLOUDINARY_API_KEY.' });
      }
    }

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename || req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Error handlers ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[API Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Export ───────────────────────────────────────────────────────────────────
// Vercel memanggil module.exports sebagai handler — TIDAK ada app.listen()
module.exports = app;
