const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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

// Upload endpoint (placeholder - untuk implementasi file upload)
app.post('/api/upload', async (req, res) => {
  res.json({ message: 'Upload functionality - implement with multer' });
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
