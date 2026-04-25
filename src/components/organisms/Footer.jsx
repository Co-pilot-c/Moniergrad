export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-10 sm:pt-16 pb-6 sm:pb-8">
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">

         {/* Brand */}
         <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
             Organisasi
           </h1>
           <p className="text-xs sm:text-sm text-gray-900">
             Membangun generasi kreatif dan berprestasi melalui kolaborasi
             dan inovasi.
           </p>
         </div>

         {/* Navigation */}
         <div>
           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
             Navigasi
           </h2>
           <ul className="space-y-1 sm:space-y-2">
             <li><a href="#home" className="hover:text-white text-sm sm:text-base">Home</a></li>
             <li><a href="#about" className="hover:text-white text-sm sm:text-base">About</a></li>
             <li><a href="#program" className="hover:text-white text-sm sm:text-base">Program</a></li>
             <li><a href="#contact" className="hover:text-white text-sm sm:text-base">Contact</a></li>
           </ul>
         </div>

         {/* Contact */}
         <div className="sm:col-span-2 md:col-span-1">
           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
             Kontak
           </h2>
           <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
             <li>Email: organisasi@email.com</li>
             <li>Phone: +62 812 3456 7890</li>
             <li>Majalengka, Indonesia</li>
           </ul>
         </div>

       </div>

       {/* Bottom */}
       <div className="border-t border-gray-700 mt-6 sm:mt-10 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-500">
         © {new Date().getFullYear()} Organisasi. All rights reserved.
       </div>

     </footer>
   );
 }