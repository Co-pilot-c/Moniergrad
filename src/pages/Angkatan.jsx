import { data, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";

// Data dummy untuk angkatan
const angkatanData = [
  {
    id: 1,
    angkatan: "2021",
    status: "Alumni",
    image: "/images/angkatan/2021.jpg",
    description: "Angkatan pertama yang memulai perjalanan Dewan Ambalan dengan semangat pembaruan dan inovasi.",
    members: [
      {
        id: 1,
        name: "Ahmad Rizki Pratama",
        position: "Ketua Dewan",
        image: "/images/members/ahmad-rizki.jpg",
        bidang: "Kepemimpinan",
        social: {
          instagram: "https://instagram.com/ahmadrizki",
          linkedin: "https://linkedin.com/in/ahmadrizki"
        }
      },
      {
        id: 2,
        name: "Siti Nurhaliza",
        position: "Wakil Ketua",
        image: "/images/members/siti-nurhaliza.jpg",
        bidang: "Administrasi",
        social: {
          instagram: "https://instagram.com/sitinurhaliza",
          linkedin: "https://linkedin.com/in/sitinurhaliza"
        }
      },
      {
        id: 3,
        name: "Muhammad Fauzi",
        position: "Sekretaris",
        image: "/images/members/muhammad-fauzi.jpg",
        bidang: "Dokumentasi",
        social: {
          instagram: "https://instagram.com/muhammadfauzi",
          linkedin: "https://linkedin.com/in/muhammadfauzi"
        }
      },
      {
        id: 4,
        name: "Dewi Kartika Sari",
        position: "Bendahara",
        image: "/images/members/dewi-kartika.jpg",
        bidang: "Keuangan",
        social: {
          instagram: "https://instagram.com/dewikartika",
          linkedin: "https://linkedin.com/in/dewikartika"
        }
      },
      {
        id: 5,
        name: "Budi Santoso",
        position: "Kepala Divisi Pendidikan",
        image: "/images/members/budi-santoso.jpg",
        bidang: "Pendidikan",
        social: {
          instagram: "https://instagram.com/budisantoso",
          linkedin: "https://linkedin.com/in/budisantoso"
        }
      },
      {
        id: 6,
        name: "Rina Amelia",
        position: "Kepala Divisi Sosial",
        image: "/images/members/rina-amelia.jpg",
        bidang: "Sosial",
        social: {
          instagram: "https://instagram.com/rinaamelia",
          linkedin: "https://linkedin.com/in/rinaamelia"
        }
      }
    ]
  },
  {
    id: 2,
    angkatan: "2022",
    status: "Alumni",
    image: "/images/angkatan/2022.jpg",
    description: "Angkatan kedua yang melanjutkan warisan dengan prestasi gemilang dan kontribusi signifikan.",
    members: [
      {
        id: 7,
        name: "Rizki Ahmad Wijaya",
        position: "Ketua Dewan",
        image: "/images/members/rizki-ahmad.jpg",
        bidang: "Kepemimpinan",
        social: {
          instagram: "https://instagram.com/rizkiahmad",
          linkedin: "https://linkedin.com/in/rizkiahmad"
        }
      },
      {
        id: 8,
        name: "Maya Putri Sari",
        position: "Wakil Ketua",
        image: "/images/members/maya-putri.jpg",
        bidang: "Administrasi",
        social: {
          instagram: "https://instagram.com/mayaputri",
          linkedin: "https://linkedin.com/in/mayaputri"
        }
      },
      {
        id: 9,
        name: "Fajar Nugroho",
        position: "Sekretaris",
        image: "/images/members/fajar-nugroho.jpg",
        bidang: "Dokumentasi",
        social: {
          instagram: "https://instagram.com/fajarnugroho",
          linkedin: "https://linkedin.com/in/fajarnugroho"
        }
      },
      {
        id: 10,
        name: "Sarah Indah Lestari",
        position: "Bendahara",
        image: "/images/members/sarah-indah.jpg",
        bidang: "Keuangan",
        social: {
          instagram: "https://instagram.com/sarahindah",
          linkedin: "https://linkedin.com/in/sarahindah"
        }
      },
      {
        id: 11,
        name: "Andi Pratama",
        position: "Kepala Divisi Olahraga",
        image: "/images/members/andi-pratama.jpg",
        bidang: "Olahraga",
        social: {
          instagram: "https://instagram.com/andipratama",
          linkedin: "https://linkedin.com/in/andipratama"
        }
      },
      {
        id: 12,
        name: "Lisa Permata Sari",
        position: "Kepala Divisi Kesenian",
        image: "/images/members/lisa-permata.jpg",
        bidang: "Kesenian",
        social: {
          instagram: "https://instagram.com/lisapermata",
          linkedin: "https://linkedin.com/in/lisapermata"
        }
      },
      {
        id: 13,
        name: "Hendra Kusuma",
        position: "Kepala Divisi Teknologi",
        image: "/images/members/hendra-kusuma.jpg",
        bidang: "Teknologi",
        social: {
          instagram: "https://instagram.com/hendrakusuma",
          linkedin: "https://linkedin.com/in/hendrakusuma"
        }
      }
    ]
  },
  {
    id: 3,
    angkatan: "2023",
    status: "Alumni",
    image: "/images/angkatan/2023.jpg",
    description: "Angkatan ketiga yang membawa angin segar dengan ide kreatif dan program inovatif.",
    members: [
      {
        id: 14,
        name: "Dimas Prasetyo",
        position: "Ketua Dewan",
        image: "/images/members/dimas-prasetyo.jpg",
        bidang: "Kepemimpinan",
        social: {
          instagram: "https://instagram.com/dimasprasetyo",
          linkedin: "https://linkedin.com/in/dimasprasetyo"
        }
      },
      {
        id: 15,
        name: "Nadia Fitriani",
        position: "Wakil Ketua",
        image: "/images/members/nadia-fitriani.jpg",
        bidang: "Administrasi",
        social: {
          instagram: "https://instagram.com/nadiafitriani",
          linkedin: "https://linkedin.com/in/nadiafitriani"
        }
      },
      {
        id: 16,
        name: "Rizky Ramadan",
        position: "Sekretaris",
        image: "/images/members/rizky-ramadan.jpg",
        bidang: "Dokumentasi",
        social: {
          instagram: "https://instagram.com/rizkyramadan",
          linkedin: "https://linkedin.com/in/rizkyramadan"
        }
      },
      {
        id: 17,
        name: "Citra Puspita Sari",
        position: "Bendahara",
        image: "/images/members/citra-puspita.jpg",
        bidang: "Keuangan",
        social: {
          instagram: "https://instagram.com/citrapuspita",
          linkedin: "https://linkedin.com/in/citrapuspita"
        }
      },
      {
        id: 18,
        name: "Bayu Setiawan",
        position: "Kepala Divisi Lingkungan",
        image: "/images/members/bayu-setiawan.jpg",
        bidang: "Lingkungan",
        social: {
          instagram: "https://instagram.com/bayusetiawan",
          linkedin: "https://linkedin.com/in/bayusetiawan"
        }
      },
      {
        id: 19,
        name: "Angelina Kusuma",
        position: "Kepala Divisi Kesehatan",
        image: "/images/members/angelina-kusuma.jpg",
        bidang: "Kesehatan",
        social: {
          instagram: "https://instagram.com/angelinakusuma",
          linkedin: "https://linkedin.com/in/angelinakusuma"
        }
      },
      {
        id: 20,
        name: "Reza Fahlevi",
        position: "Kepala Divisi Media",
        image: "/images/members/reza-fahlevi.jpg",
        bidang: "Media",
        social: {
          instagram: "https://instagram.com/rezafahlevi",
          linkedin: "https://linkedin.com/in/rezafahlevi"
        }
      },
      {
        id: 21,
        name: "Dinda Amalia",
        position: "Kepala Divisi Humas",
        image: "/images/members/dinda-amalia.jpg",
        bidang: "Humas",
        social: {
          instagram: "https://instagram.com/dindaamalia",
          linkedin: "https://linkedin.com/in/dindaamalia"
        }
      }
    ]
  },
  {
    id: 4,
    angkatan: "2024",
    status: "Aktif",
    image: "/images/angkatan/2024.jpg",
    description: "Angkatan keempat yang sedang berjuang mengukir prestasi dan melanjutkan estafet kepemimpinan.",
    members: [
      {
        id: 22,
        name: "Muhammad Alif Fadillah",
        position: "Ketua Dewan",
        image: "/images/members/alif-fadillah.jpg",
        bidang: "Kepemimpinan",
        social: {
          instagram: "https://instagram.com/aliffadillah",
          linkedin: "https://linkedin.com/in/aliffadillah"
        }
      },
      {
        id: 23,
        name: "Aisyah Rahmadhani",
        position: "Wakil Ketua",
        image: "/images/members/aisyah-rahmadhani.jpg",
        bidang: "Administrasi",
        social: {
          instagram: "https://instagram.com/aisyahrahmadhani",
          linkedin: "https://linkedin.com/in/aisyahrahmadhani"
        }
      },
      {
        id: 24,
        name: "Rafi Ahmad Habibi",
        position: "Sekretaris",
        image: "/images/members/rafi-ahmad.jpg",
        bidang: "Dokumentasi",
        social: {
          instagram: "https://instagram.com/rafiahmad",
          linkedin: "https://linkedin.com/in/rafiahmad"
        }
      },
      {
        id: 25,
        name: "Zahra Amani Putri",
        position: "Bendahara",
        image: "/images/members/zahra-amani.jpg",
        bidang: "Keuangan",
        social: {
          instagram: "https://instagram.com/zahraamani",
          linkedin: "https://linkedin.com/in/zahraamani"
        }
      },
      {
        id: 26,
        name: "Fathan Hibatullah",
        position: "Kepala Divisi Pendidikan",
        image: "/images/members/fathan-hibatullah.jpg",
        bidang: "Pendidikan",
        social: {
          instagram: "https://instagram.com/fathanhibatullah",
          linkedin: "https://linkedin.com/in/fathanhibatullah"
        }
      },
      {
        id: 27,
        name: "Naura Kania Ramadhani",
        position: "Kepala Divisi Sosial",
        image: "/images/members/naura-kania.jpg",
        bidang: "Sosial",
        social: {
          instagram: "https://instagram.com/naurakania",
          linkedin: "https://linkedin.com/in/naurakania"
        }
      },
      {
        id: 28,
        name: "M. Daffa Rizki",
        position: "Kepala Divisi Olahraga",
        image: "/images/members/daffa-rizki.jpg",
        bidang: "Olahraga",
        social: {
          instagram: "https://instagram.com/daffarizki",
          linkedin: "https://linkedin.com/in/daffarizki"
        }
      },
      {
        id: 29,
        name: "Salma Azzahra",
        position: "Kepala Divisi Kesenian",
        image: "/images/members/salma-azzahra.jpg",
        bidang: "Kesenian",
        social: {
          instagram: "https://instagram.com/salmaazzahra",
          linkedin: "https://linkedin.com/in/salmaazzahra"
        }
      },
      {
        id: 30,
        name: "Abdul Aziz",
        position: "Kepala Divisi Teknologi",
        image: "/images/members/abdul-aziz.jpg",
        bidang: "Teknologi",
        social: {
          instagram: "https://instagram.com/abdulaziz",
          linkedin: "https://linkedin.com/in/abdulaziz"
        }
      }
    ]
  },
  {
    id: 5,
    angkatan: "2025",
    status: "Calon",
    image: "/images/angkatan/2025.jpg",
    description: "Angkatan kelima yang siap melanjutkan perjuangan dengan semangat baru dan visi masa depan.",
    members: [
      {
        id: 31,
        name: "Rizki Maulana Ibrahim",
        position: "Calon Ketua Dewan",
        image: "/images/members/rizki-maulana.jpg",
        bidang: "Kepemimpinan",
        social: {
          instagram: "https://instagram.com/rizkimaulana",
          linkedin: "https://linkedin.com/in/rizkimaulana"
        }
      },
      {
        id: 32,
        name: "Siti Aisyah Putri",
        position: "Calon Wakil Ketua",
        image: "/images/members/siti-aisyah.jpg",
        bidang: "Administrasi",
        social: {
          instagram: "https://instagram.com/sitiaisyah",
          linkedin: "https://linkedin.com/in/sitiaisyah"
        }
      },
      {
        id: 33,
        name: "Muhammad Ihsan",
        position: "Calon Sekretaris",
        image: "/images/members/muhammad-ihsan.jpg",
        bidang: "Dokumentasi",
        social: {
          instagram: "https://instagram.com/muhammadihsan",
          linkedin: "https://linkedin.com/in/muhammadihsan"
        }
      },
      {
        id: 34,
        name: "Fitri Handayani",
        position: "Calon Bendahara",
        image: "/images/members/fitri-handayani.jpg",
        bidang: "Keuangan",
        social: {
          instagram: "https://instagram.com/fitrihandayani",
          linkedin: "https://linkedin.com/in/fitrihandayani"
        }
      },
      {
        id: 35,
        name: "Arif Rahman Hakim",
        position: "Calon Kepala Divisi",
        image: "/images/members/arif-rahman.jpg",
        bidang: "Pendidikan",
        social: {
          instagram: "https://instagram.com/arifrahman",
          linkedin: "https://linkedin.com/in/arifrahman"
        }
      },
      {
        id: 36,
        name: "Nabila Zahra",
        position: "Calon Kepala Divisi",
        image: "/images/members/nabila-zahra.jpg",
        bidang: "Humas",
        social: {
          instagram: "https://instagram.com/nabilazahra",
          linkedin: "https://linkedin.com/in/nabilazahra"
        }
      }
    ]
  }
];

// Export untuk digunakan di komponen lain
export { angkatanData };

export default function Angkatan({
  image,
  status,
  angkatan,
  handlePrev,
  handleNext,
  mode = "simple",
  dataAngkatan,
}) {
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className={`relative flex justify-between items-end h-[60vh] sm:h-[70vh] md:h-screen mx-4 sm:m-6 rounded-xl overflow-hidden
        ${mode === "simple" ? "md:m-0 md:rounded-none" : "md:m-10 md:rounded-2xl"}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />

      {mode === "detail" && (
        <HashLink
          smooth
          to="/#strukture"
          className={`z-20 flex items-center text-gray-900 bg-white shadow-lg py-2 px-3 lg:px-3 lg:py-2 rounded-full
          ${isScrolled ? "fixed top-5 left-5" : "absolute top-3 left-3"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="w-6"
          >
            <path
              fill="rgb(12, 12, 12)"
              d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
            />
          </svg>
          <span className="hidden sm:inline">Kembali</span>
        </HashLink>
      )}

      <div className="relative z-10 text-left p-5 sm:p-8 md:p-10 text-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2 animate-scaleIn">
          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
          <span className="text-sm md:text-md font-medium">{status}</span>
        </div>
        <h2 className="font-poppins text-green-200 font-bold text-sm sm:text-xl md:text-2xl lg:text-3xl">
          Dewan Ambalan
        </h2>
        <h1 className="font-poppins font-bold text-xl sm:text-4xl md:text-5xl lg:text-6xl">
          MONIERGRAD {angkatan}
        </h1>

        {mode === "detail" && (
          <p className="w-3/3 text-xs lg:w-1/2 lg:text-base">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut
            dolores repudiandae tenetur iusto quas libero laboriosam ipsam ipsum
            a explicabo, obcaecati harum soluta dolorum, magni laudantium nemo
            illum quidem officia.
          </p>
        )}

        {mode === "simple" && (
          <button className="bg-white text-gray-900 mt-5 px-4 py-2 md:px-3 md:py-2 md:px-4 md:py2 lg:px-5 lg:py-3  hover:bg-white/50 text-sm font-semibold rounded-full">
            <Link to="/profile" state={{ data: dataAngkatan }}>
              {" "}
              Selengkapnya
            </Link>
          </button>
        )}
      </div>

      {mode === "simple" && (
        <div className="relative flex z-10 justify-end p-5 sm:p-8 md:p-10 gap-5">
          <button
            onClick={handlePrev}
            className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-full"
          >
            ❮
          </button>

          <button
            onClick={handleNext}
            className="bg-white w-12 h-12 md:w-16 md:h-16  rounded-full"
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
}
