/**
 * Seed dummy data untuk testing CMS
 * Jalankan: node src/seed.js
 */
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_eTyj9Z5aRVlA@ep-withered-tooth-ant0kwmh-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding dummy data...\n');

  // Clear existing data
  await prisma.hero.deleteMany();
  await prisma.struktur.deleteMany();
  await prisma.purna.deleteMany();
  await prisma.program.deleteMany();
  await prisma.siteSettings.deleteMany();
  console.log('✓ Cleared existing data');

  // ── HERO ──────────────────────────────────────────
  await prisma.hero.create({
    data: {
      title: 'Dewan Ambalan Monierson & Gradison',
      subtitle: 'SMKN 1 Majalengka',
      description: 'Membangun generasi pramuka yang berkarakter, berprestasi, dan berdedikasi untuk bangsa dan negara.',
      btn1Text: 'Jelajahi',
      btn1Link: '#about',
      btn2Text: 'Lihat Anggota',
      btn2Link: '#strukture',
      order: 1,
      active: true,
    },
  });
  console.log('✓ Hero seeded');

  // ── STRUKTUR ──────────────────────────────────────
  const strukturData = [
    { title: 'Raka Prasetya', role: 'Pradana Putra', angkatan: '51', angkatanStatus: 'Menjabat', order: 1 },
    { title: 'Alfath Rizky', role: 'Pradana Putri', angkatan: '51', angkatanStatus: 'Menjabat', order: 2 },
    { title: 'Dimas Saputra', role: 'Pemangku Adat', angkatan: '51', angkatanStatus: 'Menjabat', order: 3 },
    { title: 'Siti Nurhaliza', role: 'Kerani', angkatan: '51', angkatanStatus: 'Menjabat', order: 4 },
    { title: 'Budi Santoso', role: 'Bendahara', angkatan: '51', angkatanStatus: 'Menjabat', order: 5 },
    { title: 'Ahmad Fauzi', role: 'Pradana Putra', angkatan: '50', angkatanStatus: 'Demisioner', order: 1 },
    { title: 'Dewi Rahayu', role: 'Pradana Putri', angkatan: '50', angkatanStatus: 'Demisioner', order: 2 },
  ];
  for (const s of strukturData) {
    await prisma.struktur.create({ data: { ...s, active: true } });
  }
  console.log('✓ Struktur seeded (7 anggota, 2 angkatan)');

  // ── PURNA ─────────────────────────────────────────
  const purnaData = [
    {
      title: 'Bang Jaja',
      angkatan: 'Angkatan 49',
      quotes: 'Pramuka mengajarkan saya arti tanggung jawab dan kepemimpinan sejati. Pengalaman di Dewan Ambalan tidak akan pernah terlupakan.',
      order: 1,
    },
    {
      title: 'Kak Rizky',
      angkatan: 'Angkatan 50',
      quotes: 'Dari sinilah saya belajar bahwa kerja keras dan kebersamaan adalah kunci kesuksesan. Terima kasih Moniergrad!',
      order: 2,
    },
    {
      title: 'Kak Sari',
      angkatan: 'Angkatan 48',
      quotes: 'Dewan Ambalan membentuk karakter saya menjadi pribadi yang lebih disiplin dan bertanggung jawab.',
      order: 3,
    },
  ];
  for (const p of purnaData) {
    await prisma.purna.create({ data: { ...p, active: true } });
  }
  console.log('✓ Purna seeded (3 alumni)');

  // ── PROGRAM ───────────────────────────────────────
  const programData = [
    {
      title: 'PECAPA 2025',
      description: 'Pelantikan Calon Penegak — kegiatan sakral yang menandai perjalanan anggota baru memasuki jenjang Penegak dalam Dewan Ambalan Monierson & Gradison.',
      order: 1,
    },
    {
      title: 'Kemah Bakti',
      description: 'Kegiatan kemah bakti sosial yang dilaksanakan di desa binaan, meliputi kegiatan bersih lingkungan, penyuluhan kesehatan, dan pemberdayaan masyarakat.',
      order: 2,
    },
    {
      title: 'Latihan Rutin',
      description: 'Latihan kepramukaan mingguan yang mencakup baris-berbaris, tali-temali, sandi, dan pengembangan soft skill kepemimpinan.',
      order: 3,
    },
  ];
  for (const p of programData) {
    await prisma.program.create({ data: { ...p, active: true } });
  }
  console.log('✓ Program seeded (3 program)');

  // ── SETTINGS ──────────────────────────────────────
  await prisma.siteSettings.create({
    data: {
      siteTitle: 'Dewan Ambalan Monierson & Gradison',
      siteDescription: 'Website resmi Dewan Ambalan Monierson & Gradison SMKN 1 Majalengka',
    },
  });
  console.log('✓ Settings seeded');

  console.log('\n✅ Seeding complete!');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
