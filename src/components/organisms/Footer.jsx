export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Organisasi
          </h1>
          <p className="text-sm text-gray-400">
            Membangun generasi kreatif dan berprestasi melalui kolaborasi
            dan inovasi.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Navigasi
          </h2>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#program" className="hover:text-white">Program</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Kontak
          </h2>
          <ul className="space-y-2 text-sm">
            <li>Email: organisasi@email.com</li>
            <li>Phone: +62 812 3456 7890</li>
            <li>Majalengka, Indonesia</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Organisasi. All rights reserved.
      </div>

    </footer>
  );
}