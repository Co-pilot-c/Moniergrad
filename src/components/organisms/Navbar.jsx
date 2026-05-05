import NavMenu from "../molecules/NavMenu";
import Monierson from "../../assets/vector/Monierson.png";
import Gradison from "../../assets/vector/Gradison.png";
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`z-50 transition-all duration-400 ease-out
    ${isHome && !isScrolled ? "absolute top-8 w-full" : "w-11/12 lg:w-5/6 bg-white/95 backdrop-blur-md rounded-full shadow-soft fixed top-4 left-1/2 -translate-x-1/2"}`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-400
        ${isScrolled ? "px-10 py-3" : "px-12 lg:px-32 py-5"}`}
        >
          {/* LOGO */}
          {!isFotografer && (
            <div className="flex items-center gap-10 group">
              <div
                className={`w-8 h-8 rounded-full flex gap-2 items-center justify-center transition-all duration-400 group-hover:scale-110 ${isScrolled ? "" : ""}`}
              >
                <img src={Monierson} alt="" />
                <img src={Gradison} alt="" />
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
              className={`md:hidden p-2 rounded-lg transition-all duration-400 relative w-10 h-10 flex items-center justify-center ${
                isScrolled
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span
                  className={`block h-0.5 w-full transition-all duration-300 origin-left ${open ? "rotate-45 translate-y-1.5" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}
                ></span>
                <span
                  className={`block h-0.5 w-full transition-all duration-300 ${open ? "opacity-0" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}
                ></span>
                <span
                  className={`block h-0.5 w-full transition-all duration-300 origin-left ${open ? "-rotate-45 -translate-y-1.5" : ""} ${isScrolled ? "bg-gray-900" : "bg-white"}`}
                ></span>
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

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fadeIn"
            onClick={() => setOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[70] shadow-large animate-slideIn">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center px-6 pt-12 border-b border-gray-100">
                <div className="flex flex-col items-center gap-5">
                  <div className="w-8 h-8 flex gap-2 items-center justify-end">
                    <img src={Monierson} alt="" />
                    <img src={Gradison} alt="" />
                  </div>
                  <h1 className="text-gray-900 font-bold text-lg">
                    DewanAmbalan
                  </h1>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-6">
                <div className="space-y-2">
                  {[
                    {
                      href: "#home",
                      label: "Home",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(19, 165, 65)"
                            d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"
                          />
                        </svg>
                      ),
                    },
                    {
                      href: "#about",
                      label: "About",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(19, 165, 65)"
                            d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"
                          />
                        </svg>
                      ),
                    },
                    {
                      href: "#strukture",
                      label: "Anggota",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(19, 165, 65)"
                            d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
                          />
                        </svg>
                      ),
                    },
                    {
                      href: "#program",
                      label: "Program",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(19, 165, 65)"
                            d="M384 64C407.7 64 428.4 76.9 439.4 96L448 96C483.3 96 512 124.7 512 160L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 160C128 124.7 156.7 96 192 96L200.6 96C211.6 76.9 232.3 64 256 64L384 64zM410.9 276.6C400.2 268.8 385.2 271.2 377.4 281.9L291.8 399.6L265.3 372.2C256.1 362.7 240.9 362.4 231.4 371.6C221.9 380.8 221.6 396 230.8 405.5L277.2 453.5C282.1 458.6 289 461.3 296.1 460.8C303.2 460.3 309.7 456.7 313.9 451L416.2 310.1C424 299.4 421.6 284.4 410.9 276.6zM264 128C250.7 128 240 138.7 240 152C240 165.3 250.7 176 264 176L376 176C389.3 176 400 165.3 400 152C400 138.7 389.3 128 376 128L264 128z"
                          />
                        </svg>
                      ),
                    },
                    {
                      href: "#purna",
                      label: "Alumni",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(19, 165, 65)"
                            d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"
                          />
                        </svg>
                      ),
                    },
                  ].map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-green hover:text-white transition-all duration-300 group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                      <svg
                        className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-green text-white rounded-xl text-center font-medium shadow-green hover:shadow-medium transition-all duration-400 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
