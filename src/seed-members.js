const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';
const img = (sub, file) => `${API_BASE}/uploads/${sub}/${file}`;
const def = img('members', 'default-member.jpeg');

async function run() {
  const angkatans = await prisma.angkatan.findMany({ orderBy: { order: 'asc' } });
  console.log('Found angkatans:', angkatans.map(a => a.nama));

  for (const a of angkatans) {
    const count = await prisma.anggotaAngkatan.count({ where: { angkatanId: a.id } });
    if (count > 0) {
      console.log(`Skip ${a.nama} - already has ${count} members`);
      continue;
    }

    let members = [];
    if (a.nama === '51' || a.nama === '51/15') {
      members = [
        { name: 'Rizki Ahmad Wijaya', position: 'Ketua Dewan', image: img('members','patt.jpg'), bidang: 'Kepemimpinan', instagram: 'https://instagram.com/rizkiahmad', order: 1 },
        { name: 'Maya Putri Sari', position: 'Wakil Ketua', image: def, bidang: 'Administrasi', instagram: 'https://instagram.com/mayaputri', order: 2 },
        { name: 'Fajar Nugroho', position: 'Sekretaris', image: def, bidang: 'Dokumentasi', instagram: 'https://instagram.com/fajarnugroho', order: 3 },
        { name: 'Sarah Indah Lestari', position: 'Bendahara', image: def, bidang: 'Keuangan', instagram: 'https://instagram.com/sarahindah', order: 4 },
        { name: 'Andi Pratama', position: 'Kepala Divisi Olahraga', image: def, bidang: 'Olahraga', instagram: 'https://instagram.com/andipratama', order: 5 },
        { name: 'Lisa Permata Sari', position: 'Kepala Divisi Kesenian', image: def, bidang: 'Kesenian', instagram: 'https://instagram.com/lisapermata', order: 6 },
        { name: 'Hendra Kusuma', position: 'Kepala Divisi Teknologi', image: img('members','kl.png'), bidang: 'Teknologi', instagram: 'https://instagram.com/hendrakusuma', order: 7 },
      ];
    } else if (a.nama === '50' || a.nama === '50/14') {
      members = [
        { name: 'Ahmad Rizki Pratama', position: 'Ketua Dewan', image: def, bidang: 'Kepemimpinan', instagram: 'https://instagram.com/ahmadrizki', order: 1 },
        { name: 'Siti Nurhaliza', position: 'Wakil Ketua', image: def, bidang: 'Administrasi', instagram: 'https://instagram.com/sitinurhaliza', order: 2 },
        { name: 'Muhammad Fauzi', position: 'Sekretaris', image: def, bidang: 'Dokumentasi', instagram: 'https://instagram.com/muhammadfauzi', order: 3 },
        { name: 'Dewi Kartika Sari', position: 'Bendahara', image: def, bidang: 'Keuangan', instagram: 'https://instagram.com/dewikartika', order: 4 },
        { name: 'Budi Santoso', position: 'Kepala Divisi Pendidikan', image: def, bidang: 'Pendidikan', instagram: 'https://instagram.com/budisantoso', order: 5 },
        { name: 'Rina Amelia', position: 'Kepala Divisi Sosial', image: def, bidang: 'Sosial', instagram: 'https://instagram.com/rinaamelia', order: 6 },
      ];
    } else {
      members = [
        { name: 'Dimas Prasetyo', position: 'Ketua Dewan', image: def, bidang: 'Kepemimpinan', instagram: 'https://instagram.com/dimasprasetyo', order: 1 },
        { name: 'Nadia Fitriani', position: 'Wakil Ketua', image: def, bidang: 'Administrasi', instagram: 'https://instagram.com/nadiafitriani', order: 2 },
        { name: 'Rizky Ramadan', position: 'Sekretaris', image: def, bidang: 'Dokumentasi', instagram: 'https://instagram.com/rizkyramadan', order: 3 },
        { name: 'Citra Puspita Sari', position: 'Bendahara', image: def, bidang: 'Keuangan', instagram: 'https://instagram.com/citrapuspita', order: 4 },
        { name: 'Bayu Setiawan', position: 'Kepala Divisi Lingkungan', image: def, bidang: 'Lingkungan', instagram: 'https://instagram.com/bayusetiawan', order: 5 },
        { name: 'Angelina Kusuma', position: 'Kepala Divisi Kesehatan', image: def, bidang: 'Kesehatan', instagram: 'https://instagram.com/angelinakusuma', order: 6 },
      ];
    }

    await prisma.anggotaAngkatan.createMany({
      data: members.map(m => ({ ...m, angkatanId: a.id, active: true }))
    });
    console.log(`✅ Seeded ${members.length} members for angkatan ${a.nama}`);
  }

  console.log('Done!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
