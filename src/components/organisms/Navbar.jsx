import NavMenu from "../molecules/NavMenu";
import logo from "../../assets/vector/logo.png";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isFotografer = location.pathname.startsWith("/fotografer");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`z-50 transition-all duration-400 ease-out
    ${isHome && !isScrolled ? "absolute top-8 w-full" : "w-11/12 lg:w-5/6 bg-white/95 backdrop-blur-md rounded-full shadow-soft fixed top-4 left-1/2 -translate-x-1/2"}`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-400
        ${isScrolled ? "px-6 py-3" : "px-8 lg:px-20 py-5"}`}
        >
          {/* LOGO */}
          {!isFotografer && (
            <div className="flex items-center gap-2 group">
              <div className={`w-10 h-10 rounded-full bg-gradient-green flex items-center justify-center transition-all duration-400 group-hover:scale-110 ${isScrolled ? "shadow-green" : "shadow-lg"}`}>
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <h1
                className={`text-sm md:text-lg font-bold transition-colors duration-400
                ${isScrolled ? "text-gray-900" : "text-white"}`}
              >
                DewanAmbalan
              </h1>
            </div>
          )}

          {/* NAV MENU (DESKTOP) */}
          {!isFotografer && (
            <div
              className={`hidden md:flex absolute left-1/2 -translate-x-1/2 gap-1
          ${isScrolled ? "text-gray-900" : "text-white"}`}
            >
              <NavMenu currentPath={location.pathname} />
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* CONTACT (DESKTOP) */}
            <Link
              to="/contact"
              className={`hidden md:block px-6 py-2.5 rounded-full font-medium transition-all duration-400 transform hover:scale-105 ${
                isScrolled
                  ? "bg-gradient-green text-white shadow-green hover:shadow-medium"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-gray-900"
              }`}
            >
              Contact
            </Link>

            {/* HAMBURGER */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-lg transition-all duration-400 ${
                isScrolled 
                  ? "text-gray-900 hover:bg-gray-100" 
                  : "text-white hover:bg-white/20"
              }`}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full transition-all duration-400 ${open ? "rotate-45 translate-y-2" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}></span>
                <span className={`block h-0.5 w-full transition-all duration-400 ${open ? "opacity-0" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}></span>
                <span className={`block h-0.5 w-full transition-all duration-400 ${open ? "-rotate-45 -translate-y-2" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* BACK BUTTON */}
        {!isHome && (
          <Link
            to="/#home"
            className="absolute left-5 top-20 flex items-center gap-2 text-white md:hidden hover:text-primary-300 transition-colors duration-300"
          >
            <span className="text-lg">←</span> Home
          </Link>
        )}
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`fixed bg-white z-[70] shadow-large rounded-2xl p-6 flex flex-col gap-6 animate-scaleIn 
            ${isScrolled ? "top-20 left-1/2 -translate-x-1/2 w-11/12" : "top-24 left-1/2 -translate-x-1/2 w-11/12"}`}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-green flex items-center justify-center shadow-green">
                  <span className="text-white font-bold text-lg">DA</span>
                </div>
                <h1 className="text-gray-900 font-bold text-lg">
                  DewanAmbalan
                </h1>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>

            <NavMenu
              currentPath={location.pathname}
              onClick={() => setOpen(false)}
            />

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="px-6 py-3 bg-gradient-green text-white rounded-full text-center font-medium shadow-green hover:shadow-medium transition-all duration-400 transform hover:scale-105"
            >
              Contact
            </Link>
          </div>
        </>
      )}
    </>
  );
}
