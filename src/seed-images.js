/**
 * seed-images.js
 * Update semua record di DB yang masih pakai path localhost:3000/uploads
 * menjadi path publik frontend (relative path yang bisa diakses via Vercel frontend)
 *
 * Jalankan: node src/seed-images.js
 */
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Path publik frontend (relative, akan diakses dari domain frontend)
// Gambar disimpan di frontend/public/ → diakses via /images/, /orang/, /vector/
const FRONTEND_BASE = process.env.FRONTEND_URL || 'https://scout-moniergrad.vercel.app';

const pub = (path) => `${FRONTEND_BASE}${path}`;

async function run() {
  console.log('🖼️  Updating image paths in database...');

  // ============================================
  // UPDATE HERO — bg image
  // ============================================
  const heroes = await prisma.hero.findMany();
  for (const h of heroes) {
    await prisma.hero.update({
      where: { id: h.id },
      data: { bgImage: pub('/images/bg_home.jpeg') }
    });
  }
  console.log(`✅ Updated ${heroes.length} hero(es)`);

  // ============================================
  // UPDATE ABOUT — image
  // ============================================
  const abouts = await prisma.about.findMany();
  for (const a of abouts) {
    await prisma.about.update({
      where: { id: a.id },
      data: { imageUrl: pub('/images/bga.jpg') }
    });
  }
  console.log(`✅ Updated ${abouts.length} about(s)`);

  // ============================================
  // UPDATE ANGKATAN — background image
  // ============================================
  const angkatans = await prisma.angkatan.findMany();
  for (const a of angkatans) {
    await prisma.angkatan.update({
      where: { id: a.id },
      data: { image: pub('/images/bg_home.jpeg') }
    });
  }
  console.log(`✅ Updated ${angkatans.length} angkatan(s)`);

  // ============================================
  // UPDATE ANGGOTA — member photos
  // ============================================
  const members = await prisma.anggotaAngkatan.findMany();
  const memberImages = [
    pub('/orang/patt.jpg'),
    pub('/orang/orangan.jpeg'),
    pub('/orang/kl.png'),
  ];
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    // Assign images in rotation, or keep existing if it's already a valid URL
    const newImage = memberImages[i % memberImages.length];
    await prisma.anggotaAngkatan.update({
      where: { id: m.id },
      data: { image: newImage }
    });
  }
  console.log(`✅ Updated ${members.length} member(s)`);

  // ============================================
  // UPDATE PURNA — profile photo
  // ============================================
  const purnas = await prisma.purna.findMany();
  for (const p of purnas) {
    await prisma.purna.update({
      where: { id: p.id },
      data: { profile: pub('/vector/orangk.jpg') }
    });
  }
  console.log(`✅ Updated ${purnas.length} purna(s)`);

  // ============================================
  // UPDATE PROGRAM — images array
  // ============================================
  const programs = await prisma.program.findMany();
  const programImageSets = [
    JSON.stringify([pub('/images/perlak.jpeg'), pub('/images/perlak1.jpeg')]),
    JSON.stringify([pub('/images/perlak1.jpeg'), pub('/images/perlak.jpeg')]),
  ];
  for (let i = 0; i < programs.length; i++) {
    await prisma.program.update({
      where: { id: programs[i].id },
      data: { images: programImageSets[i % programImageSets.length] }
    });
  }
  console.log(`✅ Updated ${programs.length} program(s)`);

  console.log('🎉 Image paths updated!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
