export default function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="hover:underline cursor-pointer"
    >
      {children}
    </a>
  );
}
