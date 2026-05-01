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
        className={`z-50 transtion-all duration-300
    ${isHome && !isScrolled ? "absolute top-10 w-full" : "w-5/6  bg-white rounded-full shadow-md fixed top-4 left-1/2 -translate-x-1/2 z-50"}`}
      >
        <div
          className={`relative flex items-center justify-between
        ${isScrolled ? "px-3 py-2" : "px-20 py-5"}`}
        >
          {/* LOGO */}
          {!isFotografer && (
            <div className="px-3">
              <img src="" alt="" />
              <h1
                className={`text-sm md:text-lg font-bold
                ${isScrolled ? "text-gray-900" : "text-white"}`}
              >
                DewanAmbalan.
              </h1>
            </div>
          )}

          {/* NAV MENU (DESKTOP) */}
          {!isFotografer && (
            <div
              className={`hidden md:flex absolute left-1/2 -translate-x-1/2
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
              className={`hidden md:block px-5 py-2 border rounded-full transition ${
                isScrolled
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              Contact
            </Link>

            {/* HAMBURGER */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden text-2xl ${
                isScrolled ? "text-black" : "text-black"
              }`}
            >
              ☰
            </button>
          </div>
        </div>

        {/* BACK BUTTON */}
        {!isHome && (
          <Link
            to="/#home"
            className="absolute left-5 top-20 flex items-center gap-2 text-white md:hidden"
          >
            ← Home
          </Link>
        )}
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`fixed bg-white z-[70] shadow-lg p-6 flex flex-col gap-6 animate-slideIn 
            ${isScrolled ? "top-5 rounded-xl left-1/2 -translate-x-1/2 w-5/6" : "top-10 rounded-xl left-1/2 -translate-x-1/2 w-5/6"}`}
          >
            <div className="flex justify-between">
              <h1 className="text-black font-bold text-lg">
                Pattfolio<span className="text-cyan-500">.</span>
              </h1>
              <button onClick={() => setOpen(false)} className="font-bold">
                X
              </button>
            </div>

            <NavMenu
              currentPath={location.pathname}
              onClick={() => setOpen(false)}
            />

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-auto px-5 py-2 border border-black rounded-full text-center"
            >
              Contact
            </Link>
          </div>
        </>
      )}
    </>
  );
}
