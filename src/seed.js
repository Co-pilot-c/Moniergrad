const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // ADMIN
  // ============================================
  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashed,
        name: 'Administrator CMS',
      }
    });
    console.log('✅ Admin created: admin / admin123');
  } else {
    console.log('ℹ️  Admin already exists');
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
    const statsData = [
      // About section stats
      { value: '120', suffix: '+', label: 'Active', isText: false, order: 1, section: 'about' },
      { value: '92', suffix: 'K', label: 'Users', isText: false, order: 2, section: 'about' },
      { value: '25', suffix: '%', label: 'Growth', isText: false, order: 3, section: 'about' },
      { value: '12', suffix: 'K+', label: 'Testimonials', isText: false, order: 4, section: 'about' },
      // Program section stats
      { value: '120', suffix: '+', label: 'Active', isText: false, order: 1, section: 'program' },
      { value: '92', suffix: 'K', label: 'Users', isText: false, order: 2, section: 'program' },
      { value: '25', suffix: '%', label: 'Growth', isText: false, order: 3, section: 'program' },
      { value: '12', suffix: 'K+', label: 'Testimonials', isText: false, order: 4, section: 'program' },
    ];
    await prisma.stats.createMany({ data: statsData });
    console.log('✅ Stats seeded');
  }

  // ============================================
  // ANGKATAN
  // ============================================
  const angkatanCount = await prisma.angkatan.count();
  if (angkatanCount === 0) {
    const angkatan1 = await prisma.angkatan.create({
      data: {
        nama: '50/14',
        status: 'Demisioner',
        description: 'Angkatan pertama dari Dewan Ambalan Monierson & Gradison',
        order: 1,
        active: true,
      }
    });
    const angkatan2 = await prisma.angkatan.create({
      data: {
        nama: '51/15',
        status: 'Alumni',
        description: 'Angkatan kedua yang melanjutkan warisan dengan prestasi gemilang.',
        order: 2,
        active: true,
      }
    });
    const angkatan3 = await prisma.angkatan.create({
      data: {
        nama: '52/16',
        status: 'Aktif',
        description: 'Angkatan aktif yang sedang mengukir prestasi.',
        order: 3,
        active: true,
      }
    });
    console.log('✅ Angkatan seeded');
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
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga voluptates nihil dolores sunt ipsam veniam neque repudiandae minus illum voluptas officiis hic, necessitatibus ullam, reprehenderit sint architecto praesentium sequi quaerat inventore obcaecati voluptatum?',
          images: JSON.stringify([]),
          order: 1,
          active: true,
        },
        {
          title: 'Perlak',
          subtitle: 'Pelantikan Calon Bantara',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga voluptates nihil dolores sunt ipsam veniam neque repudiandae minus illum voluptas officiis hic, necessitatibus ullam.',
          images: JSON.stringify([]),
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
