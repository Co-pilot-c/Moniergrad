const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Environment detection - must be defined early
const isVercel = process.env.VERCEL === '1';

// Inject DATABASE_URL jika belum ada (fallback untuk Vercel)
// DATABASE_URL seharusnya diset di Vercel Environment Variables dashboard
// Ini hanya fallback sementara
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_eTyj9Z5aRVlA@ep-withered-tooth-ant0kwmh-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const { PrismaClient } = require('@prisma/client');

// Prisma client with connection pooling for serverless
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://web-tunakarya.vercel.app',
    ];
    
    // Allow semua localhost (port berapapun)
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow custom FRONTEND_URL dari env
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk uploads
const uploadsStaticDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsStaticDir));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      env: {
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        is_vercel: isVercel
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      env: {
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        is_vercel: isVercel
      }
    });
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
    console.error('Hero GET Error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.get('/api/hero/:id', async (req, res) => {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id: req.params.id }
    });
    if (!hero) return res.status(404).json({ error: 'Not found' });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero', async (req, res) => {
  try {
    const hero = await prisma.hero.create({
      data: req.body
    });
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero/:id', async (req, res) => {
  try {
    const hero = await prisma.hero.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero/:id', async (req, res) => {
  try {
    await prisma.hero.delete({
      where: { id: req.params.id }
    });
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

app.get('/api/struktur/:id', async (req, res) => {
  try {
    const struktur = await prisma.struktur.findUnique({
      where: { id: req.params.id }
    });
    if (!struktur) return res.status(404).json({ error: 'Not found' });
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/struktur', async (req, res) => {
  try {
    const struktur = await prisma.struktur.create({
      data: req.body
    });
    res.status(201).json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/struktur/:id', async (req, res) => {
  try {
    const struktur = await prisma.struktur.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/struktur/:id', async (req, res) => {
  try {
    await prisma.struktur.delete({
      where: { id: req.params.id }
    });
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

app.get('/api/purna/:id', async (req, res) => {
  try {
    const purna = await prisma.purna.findUnique({
      where: { id: req.params.id }
    });
    if (!purna) return res.status(404).json({ error: 'Not found' });
    res.json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purna', async (req, res) => {
  try {
    const purna = await prisma.purna.create({
      data: req.body
    });
    res.status(201).json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purna/:id', async (req, res) => {
  try {
    const purna = await prisma.purna.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(purna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/purna/:id', async (req, res) => {
  try {
    await prisma.purna.delete({
      where: { id: req.params.id }
    });
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

app.get('/api/program/:id', async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id }
    });
    if (!program) return res.status(404).json({ error: 'Not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/program', async (req, res) => {
  try {
    const program = await prisma.program.create({
      data: req.body
    });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/program/:id', async (req, res) => {
  try {
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/program/:id', async (req, res) => {
  try {
    await prisma.program.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Deleted successfully' });
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

app.put('/api/settings', async (req, res) => {
  try {
    const existing = await prisma.siteSettings.findFirst();
    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: req.body
      });
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

app.post('/api/navigation', async (req, res) => {
  try {
    const nav = await prisma.navigation.create({
      data: req.body
    });
    res.status(201).json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/navigation/:id', async (req, res) => {
  try {
    const nav = await prisma.navigation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/navigation/:id', async (req, res) => {
  try {
    await prisma.navigation.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File Upload dengan Cloudinary (persistent storage)
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'tunakarya',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Cek apakah Cloudinary dikonfigurasi
const hasCloudinary = !!(process.env.CLOUDINARY_API_KEY || '');

let upload;

if (hasCloudinary) {
  // Pakai Cloudinary untuk persistent storage
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
  // Fallback: simpan ke /tmp (tidak persistent di Vercel, tapi OK untuk dev)
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

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Cloudinary returns path as secure_url, disk returns filename
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CMS Server running on port ${PORT}`);
});

module.exports = app;
