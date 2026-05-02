export default function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:scale-105 cursor-pointer relative group"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-green transition-all duration-300 group-hover:w-1/2 transform -translate-x-1/2"></span>
    </a>
  );
}
