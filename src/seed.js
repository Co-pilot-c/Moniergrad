const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// Base URL backend untuk path gambar
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

// Helper: path gambar di folder uploads
const img = (subfolder, filename) => `${API_BASE}/uploads/${subfolder}/${filename}`;

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // ADMIN — buat dua akun
  // ============================================
  const admins = [
    { username: 'admin', password: 'admin123', name: 'Administrator CMS' },
    { username: 'amn-agd', password: 'MoNi3Rgr4D', name: 'Admin Angkatan' },
  ];

  for (const a of admins) {
    const existing = await prisma.admin.findUnique({ where: { username: a.username } });
    if (!existing) {
      const hashed = await bcrypt.hash(a.password, 12);
      await prisma.admin.create({ data: { username: a.username, password: hashed, name: a.name } });
      console.log(`✅ Admin created: ${a.username} / ${a.password}`);
    } else {
      console.log(`ℹ️  Admin already exists: ${a.username}`);
    }
  }

  // ============================================
  // HERO
  // ============================================
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    await prisma.hero.create({
      data: {
        title: 'Dewan Ambalan Monierson & Gradison',
        subtitle: 'Selamat Datang',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, distinctio natus. Adipisci necessitatibus a consectetur.',
        badgeText: 'Welcome to Our Community',
        bgImage: img('angkatan', 'bg_home.jpeg'),
        btn1Text: 'Jelajahi',
        btn1Link: '#about',
        btn2Text: 'Anggota',
        btn2Link: '#strukture',
        order: 1,
        active: true,
      }
    });
    console.log('✅ Hero seeded');
  }

  // ============================================
  // ABOUT
  // ============================================
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        tagline: 'Tentang Kami',
        title: 'Wadah untuk Menampung Ide dan Gagasan',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem officia mollitia magnam recusandae sequi? Ipsam assumenda facilis, repellendus quaerat, magnam repudiandae ducimus, dolores eum hic veniam soluta sit perferendis nulla.',
        imageUrl: img('angkatan', 'bg_home.jpeg'),
        imageQuote: 'Meninggalkan Jejak untuk Mengukir Sejarah',
        visiTitle: 'Visi',
        visiContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum porro ad sed neque reiciendis corporis, consequatur, molestiae ea saepe inventore quis aut cupiditate fugit adipisci, voluptatibus tenetur dolores esse quibusdam.',
        misiTitle: 'Misi',
        misiItems: JSON.stringify([
          'Lorem ipsum dolor sit amet.',
          'Lorem ipsum dolor, sit amet consectetur.',
          'Lorem ipsum dolor, sit amet consectetur.',
          'Lorem ipsum dolor sit amet consectetur.',
        ]),
        active: true,
      }
    });
    console.log('✅ About seeded');
  }

  // ============================================
  // STATS
  // ============================================
  const statsCount = await prisma.stats.count();
  if (statsCount === 0) {
    await prisma.stats.createMany({
      data: [
        { value: '120', suffix: '+', label: 'Active', isText: false, order: 1, section: 'about' },
        { value: '92', suffix: 'K', label: 'Users', isText: false, order: 2, section: 'about' },
        { value: '25', suffix: '%', label: 'Growth', isText: false, order: 3, section: 'about' },
        { value: '12', suffix: 'K+', label: 'Testimonials', isText: false, order: 4, section: 'about' },
        { value: '120', suffix: '+', label: 'Active', isText: false, order: 1, section: 'program' },
        { value: '92', suffix: 'K', label: 'Users', isText: false, order: 2, section: 'program' },
        { value: '25', suffix: '%', label: 'Growth', isText: false, order: 3, section: 'program' },
        { value: '12', suffix: 'K+', label: 'Testimonials', isText: false, order: 4, section: 'program' },
      ]
    });
    console.log('✅ Stats seeded');
  }

  // ============================================
  // ANGKATAN + ANGGOTA
  // ============================================
  const angkatanCount = await prisma.angkatan.count();
  if (angkatanCount === 0) {
    // Default member image
    const defaultMemberImg = img('members', 'default-member.jpeg');

    // Angkatan 50/14
    const a50 = await prisma.angkatan.create({
      data: {
        nama: '50/14',
        status: 'Demisioner',
        image: img('angkatan', 'bg_home.jpeg'),
        description: 'Angkatan pertama dari Dewan Ambalan Monierson & Gradison',
        order: 1,
        active: true,
      }
    });
    await prisma.anggotaAngkatan.createMany({
      data: [
        { angkatanId: a50.id, name: 'Ahmad Rizki Pratama', position: 'Ketua Dewan', image: defaultMemberImg, bidang: 'Kepemimpinan', instagram: 'https://instagram.com/ahmadrizki', order: 1, active: true },
        { angkatanId: a50.id, name: 'Siti Nurhaliza', position: 'Wakil Ketua', image: defaultMemberImg, bidang: 'Administrasi', instagram: 'https://instagram.com/sitinurhaliza', order: 2, active: true },
        { angkatanId: a50.id, name: 'Muhammad Fauzi', position: 'Sekretaris', image: defaultMemberImg, bidang: 'Dokumentasi', instagram: 'https://instagram.com/muhammadfauzi', order: 3, active: true },
        { angkatanId: a50.id, name: 'Dewi Kartika Sari', position: 'Bendahara', image: defaultMemberImg, bidang: 'Keuangan', instagram: 'https://instagram.com/dewikartika', order: 4, active: true },
        { angkatanId: a50.id, name: 'Budi Santoso', position: 'Kepala Divisi Pendidikan', image: defaultMemberImg, bidang: 'Pendidikan', instagram: 'https://instagram.com/budisantoso', order: 5, active: true },
        { angkatanId: a50.id, name: 'Rina Amelia', position: 'Kepala Divisi Sosial', image: defaultMemberImg, bidang: 'Sosial', instagram: 'https://instagram.com/rinaamelia', order: 6, active: true },
      ]
    });

    // Angkatan 51/15
    const a51 = await prisma.angkatan.create({
      data: {
        nama: '51/15',
        status: 'Alumni',
        image: img('angkatan', 'bg_home.jpeg'),
        description: 'Angkatan kedua yang melanjutkan warisan dengan prestasi gemilang dan kontribusi signifikan.',
        order: 2,
        active: true,
      }
    });
    await prisma.anggotaAngkatan.createMany({
      data: [
        { angkatanId: a51.id, name: 'Rizki Ahmad Wijaya', position: 'Ketua Dewan', image: img('members', 'patt.jpg'), bidang: 'Kepemimpinan', instagram: 'https://instagram.com/rizkiahmad', order: 1, active: true },
        { angkatanId: a51.id, name: 'Maya Putri Sari', position: 'Wakil Ketua', image: defaultMemberImg, bidang: 'Administrasi', instagram: 'https://instagram.com/mayaputri', order: 2, active: true },
        { angkatanId: a51.id, name: 'Fajar Nugroho', position: 'Sekretaris', image: defaultMemberImg, bidang: 'Dokumentasi', instagram: 'https://instagram.com/fajarnugroho', order: 3, active: true },
        { angkatanId: a51.id, name: 'Sarah Indah Lestari', position: 'Bendahara', image: defaultMemberImg, bidang: 'Keuangan', instagram: 'https://instagram.com/sarahindah', order: 4, active: true },
        { angkatanId: a51.id, name: 'Andi Pratama', position: 'Kepala Divisi Olahraga', image: defaultMemberImg, bidang: 'Olahraga', instagram: 'https://instagram.com/andipratama', order: 5, active: true },
        { angkatanId: a51.id, name: 'Lisa Permata Sari', position: 'Kepala Divisi Kesenian', image: defaultMemberImg, bidang: 'Kesenian', instagram: 'https://instagram.com/lisapermata', order: 6, active: true },
        { angkatanId: a51.id, name: 'Hendra Kusuma', position: 'Kepala Divisi Teknologi', image: img('members', 'kl.png'), bidang: 'Teknologi', instagram: 'https://instagram.com/hendrakusuma', order: 7, active: true },
      ]
    });

    // Angkatan 52/16
    const a52 = await prisma.angkatan.create({
      data: {
        nama: '52/16',
        status: 'Aktif',
        image: img('angkatan', 'bg_home.jpeg'),
        description: 'Angkatan aktif yang sedang mengukir prestasi dan melanjutkan estafet kepemimpinan.',
        order: 3,
        active: true,
      }
    });
    await prisma.anggotaAngkatan.createMany({
      data: [
        { angkatanId: a52.id, name: 'Dimas Prasetyo', position: 'Ketua Dewan', image: defaultMemberImg, bidang: 'Kepemimpinan', instagram: 'https://instagram.com/dimasprasetyo', order: 1, active: true },
        { angkatanId: a52.id, name: 'Nadia Fitriani', position: 'Wakil Ketua', image: defaultMemberImg, bidang: 'Administrasi', instagram: 'https://instagram.com/nadiafitriani', order: 2, active: true },
        { angkatanId: a52.id, name: 'Rizky Ramadan', position: 'Sekretaris', image: defaultMemberImg, bidang: 'Dokumentasi', instagram: 'https://instagram.com/rizkyramadan', order: 3, active: true },
        { angkatanId: a52.id, name: 'Citra Puspita Sari', position: 'Bendahara', image: defaultMemberImg, bidang: 'Keuangan', instagram: 'https://instagram.com/citrapuspita', order: 4, active: true },
        { angkatanId: a52.id, name: 'Bayu Setiawan', position: 'Kepala Divisi Lingkungan', image: defaultMemberImg, bidang: 'Lingkungan', instagram: 'https://instagram.com/bayusetiawan', order: 5, active: true },
        { angkatanId: a52.id, name: 'Angelina Kusuma', position: 'Kepala Divisi Kesehatan', image: defaultMemberImg, bidang: 'Kesehatan', instagram: 'https://instagram.com/angelinakusuma', order: 6, active: true },
        { angkatanId: a52.id, name: 'Reza Fahlevi', position: 'Kepala Divisi Media', image: defaultMemberImg, bidang: 'Media', instagram: 'https://instagram.com/rezafahlevi', order: 7, active: true },
        { angkatanId: a52.id, name: 'Dinda Amalia', position: 'Kepala Divisi Humas', image: defaultMemberImg, bidang: 'Humas', instagram: 'https://instagram.com/dindaamalia', order: 8, active: true },
      ]
    });

    console.log('✅ Angkatan + Anggota seeded');
  } else {
    console.log('ℹ️  Angkatan already exists, skipping');
  }

  // ============================================
  // PURNA
  // ============================================
  const purnaCount = await prisma.purna.count();
  if (purnaCount === 0) {
    await prisma.purna.create({
      data: {
        title: 'Alfath',
        angkatan: 'Angkatan 51',
        profile: img('purna', 'default-profile.jpg'),
        quotes: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio.',
        order: 1,
        active: true,
      }
    });
    console.log('✅ Purna seeded');
  }

  // ============================================
  // PROGRAM
  // ============================================
  const programCount = await prisma.program.count();
  if (programCount === 0) {
    await prisma.program.createMany({
      data: [
        {
          title: 'PECABA 2025',
          subtitle: 'Pelantikan Calon Bantara',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga voluptates nihil dolores sunt ipsam veniam neque repudiandae minus illum voluptas officiis hic, necessitatibus ullam, reprehenderit sint architecto praesentium sequi quaerat inventore obcaecati voluptatum? Reiciendis dicta maxime adipisci fugiat itaque, tempore facere dolor consequatur totam cum cumque repellendus accusamus, corporis laborum.',
          images: JSON.stringify([img('program', 'perlak.jpeg'), img('program', 'perlak1.jpeg')]),
          order: 1,
          active: true,
        },
        {
          title: 'Perlak',
          subtitle: 'Pelantikan Calon Bantara',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga voluptates nihil dolores sunt ipsam veniam neque repudiandae minus illum voluptas officiis hic, necessitatibus ullam.',
          images: JSON.stringify([img('program', 'perlak1.jpeg'), img('program', 'perlak.jpeg')]),
          order: 2,
          active: true,
        },
      ]
    });
    console.log('✅ Program seeded');
  }

  // ============================================
  // FOOTER
  // ============================================
  const footerCount = await prisma.footer.count();
  if (footerCount === 0) {
    await prisma.footer.create({
      data: {
        brandName: 'DewanAmbalan',
        brandDesc: 'Membangun generasi kreatif dan berprestasi melalui kolaborasi dan inovasi untuk masa depan yang lebih baik.',
        email: 'dewanambalan@email.com',
        phone: '+62 812 3456 7890',
        address: 'Majalengka, Indonesia',
        copyrightText: 'Dewan Ambalan. All rights reserved.',
        active: true,
      }
    });
    console.log('✅ Footer seeded');
  }

  // ============================================
  // SITE SETTINGS
  // ============================================
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        siteTitle: 'Dewan Ambalan Monierson & Gradison',
        siteDescription: 'Website resmi Dewan Ambalan Monierson & Gradison',
      }
    });
    console.log('✅ Site settings seeded');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
