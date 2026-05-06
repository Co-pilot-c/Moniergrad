const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============================================
// ENVIRONMENT & CONFIG
// ============================================
const isVercel = process.env.VERCEL === '1';
const JWT_SECRET = process.env.JWT_SECRET || 'tunakarya-cms-secret-2024';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_eTyj9Z5aRVlA@ep-withered-tooth-ant0kwmh-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const { PrismaClient } = require('@prisma/client');
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk uploads
const uploadsStaticDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsStaticDir));

// ============================================
// AUTH MIDDLEWARE
// ============================================
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected', error: error.message });
  }
});

// ============================================
// ROUTES: AUTH (LOGIN/LOGOUT)
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: { id: admin.id, username: admin.username, name: admin.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, username: true, name: true, createdAt: true }
    });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup admin pertama (hanya bisa dipakai jika belum ada admin)
app.post('/api/auth/setup', async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) {
      return res.status(403).json({ error: 'Admin sudah ada. Gunakan endpoint login.' });
    }
    const { username, password, name } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: { username, password: hashed, name: name || 'Administrator' }
    });
    res.status(201).json({ message: 'Admin berhasil dibuat', id: admin.id, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: HERO
// ============================================
app.get('/api/hero', async (req, res) => {
  try {
    const heroes = await prisma.hero.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hero/all', authMiddleware, async (req, res) => {
  try {
    const heroes = await prisma.hero.findMany({ orderBy: { order: 'asc' } });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hero/:id', async (req, res) => {
  try {
    const hero = await prisma.hero.findUnique({ where: { id: req.params.id } });
    if (!hero) return res.status(404).json({ error: 'Not found' });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero', authMiddleware, async (req, res) => {
  try {
    const hero = await prisma.hero.create({ data: req.body });
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero/:id', authMiddleware, async (req, res) => {
  try {
    const hero = await prisma.hero.update({ where: { id: req.params.id }, data: req.body });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.hero.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: ABOUT
// ============================================
app.get('/api/about', async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ where: { active: true } });
    res.json(about || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/about', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.about.findFirst();
    let about;
    if (existing) {
      about = await prisma.about.update({ where: { id: existing.id }, data: req.body });
    } else {
      about = await prisma.about.create({ data: req.body });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: STATS
// ============================================
app.get('/api/stats', async (req, res) => {
  try {
    const { section } = req.query;
    const where = { active: true };
    if (section) where.section = section;
    const stats = await prisma.stats.findMany({ where, orderBy: { order: 'asc' } });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/all', authMiddleware, async (req, res) => {
  try {
    const stats = await prisma.stats.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stats', authMiddleware, async (req, res) => {
  try {
    const stat = await prisma.stats.create({ data: req.body });
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stats/:id', authMiddleware, async (req, res) => {
  try {
    const stat = await prisma.stats.update({ where: { id: req.params.id }, data: req.body });
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/stats/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.stats.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: ANGKATAN
// ============================================
app.get('/api/angkatan', async (req, res) => {
  try {
    const angkatans = await prisma.angkatan.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } }
    });
    res.json(angkatans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/angkatan/all', authMiddleware, async (req, res) => {
  try {
    const angkatans = await prisma.angkatan.findMany({
      orderBy: { order: 'asc' },
      include: { members: { orderBy: { order: 'asc' } } }
    });
    res.json(angkatans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/angkatan/:id', async (req, res) => {
  try {
    const angkatan = await prisma.angkatan.findUnique({
      where: { id: req.params.id },
      include: { members: { where: { active: true }, orderBy: { order: 'asc' } } }
    });
    if (!angkatan) return res.status(404).json({ error: 'Not found' });
    res.json(angkatan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/angkatan', authMiddleware, async (req, res) => {
  try {
    const { members, ...data } = req.body;
    const angkatan = await prisma.angkatan.create({ data });
    res.status(201).json(angkatan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/angkatan/:id', authMiddleware, async (req, res) => {
  try {
    const { members, ...data } = req.body;
    const angkatan = await prisma.angkatan.update({ where: { id: req.params.id }, data });
    res.json(angkatan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/angkatan/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.angkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: ANGGOTA ANGKATAN
// ============================================
app.get('/api/angkatan/:angkatanId/members', async (req, res) => {
  try {
    const members = await prisma.anggotaAngkatan.findMany({
      where: { angkatanId: req.params.angkatanId, active: true },
      orderBy: { order: 'asc' }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/angkatan/:angkatanId/members', authMiddleware, async (req, res) => {
  try {
    const member = await prisma.anggotaAngkatan.create({
      data: { ...req.body, angkatanId: req.params.angkatanId }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    const member = await prisma.anggotaAngkatan.update({ where: { id: req.params.id }, data: req.body });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.anggotaAngkatan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: STRUKTUR
// ============================================
app.get('/api/struktur', async (req, res) => {
  try {
    const strukturs = await prisma.struktur.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(strukturs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/struktur/all', authMiddleware, async (req, res) => {
  try {
    const strukturs = await prisma.struktur.findMany({ orderBy: { order: 'asc' } });
    res.json(strukturs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/struktur/:id', async (req, res) => {
  try {
    const struktur = await prisma.struktur.findUnique({ where: { id: req.params.id } });
    if (!struktur) return res.status(404).json({ error: 'Not found' });
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/struktur', authMiddleware, async (req, res) => {
  try {
    const struktur = await prisma.struktur.create({ data: req.body });
    res.status(201).json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/struktur/:id', authMiddleware, async (req, res) => {
  try {
    const struktur = await prisma.struktur.update({ where: { id: req.params.id }, data: req.body });
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/struktur/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.struktur.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: PURNA
// ============================================
app.get('/api/purna', async (req, res) => {
  try {
    const purnas = await prisma.purna.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(purnas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purna/all', authMiddleware, async (req, res) => {
  try {
    const purnas = await prisma.purna.findMany({ orderBy: { order: 'asc' } });
    res.json(purnas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purna/:id', async (req, res) => {
  try {
    const purna = await prisma.purna.findUnique({ where: { id: req.params.id } });
    if (!purna) return res.status(404).json({ error: 'Not found' });
    res.json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purna', authMiddleware, async (req, res) => {
  try {
    const purna = await prisma.purna.create({ data: req.body });
    res.status(201).json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purna/:id', authMiddleware, async (req, res) => {
  try {
    const purna = await prisma.purna.update({ where: { id: req.params.id }, data: req.body });
    res.json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/purna/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.purna.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: PROGRAM
// ============================================
app.get('/api/program', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/program/all', authMiddleware, async (req, res) => {
  try {
    const programs = await prisma.program.findMany({ orderBy: { order: 'asc' } });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/program/:id', async (req, res) => {
  try {
    const program = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!program) return res.status(404).json({ error: 'Not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/program', authMiddleware, async (req, res) => {
  try {
    const program = await prisma.program.create({ data: req.body });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/program/:id', authMiddleware, async (req, res) => {
  try {
    const program = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/program/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: FOOTER
// ============================================
app.get('/api/footer', async (req, res) => {
  try {
    const footer = await prisma.footer.findFirst({ where: { active: true } });
    res.json(footer || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/footer', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.footer.findFirst();
    let footer;
    if (existing) {
      footer = await prisma.footer.update({ where: { id: existing.id }, data: req.body });
    } else {
      footer = await prisma.footer.create({ data: req.body });
    }
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: SITE SETTINGS
// ============================================
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.siteSettings.findFirst();
    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({ where: { id: existing.id }, data: req.body });
    } else {
      settings = await prisma.siteSettings.create({ data: req.body });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES: NAVIGATION
// ============================================
app.get('/api/navigation', async (req, res) => {
  try {
    const navs = await prisma.navigation.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(navs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/navigation', authMiddleware, async (req, res) => {
  try {
    const nav = await prisma.navigation.create({ data: req.body });
    res.status(201).json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/navigation/:id', authMiddleware, async (req, res) => {
  try {
    const nav = await prisma.navigation.update({ where: { id: req.params.id }, data: req.body });
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/navigation/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.navigation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// FILE UPLOAD
// ============================================
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'tunakarya',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

const hasCloudinary = !!(process.env.CLOUDINARY_API_KEY);
let upload;

if (hasCloudinary) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'tunakarya',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
} else {
  const uploadsDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
  if (!isVercel && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (isVercel && !fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files are allowed!'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = req.file.path || (() => {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers.host;
      return `${protocol}://${host}/uploads/${req.file.filename}`;
    })();
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename || req.file.public_id,
      url: fileUrl,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CMS Server running on port ${PORT}`);
});

module.exports = app;
