import NavLink from "../atoms/NavLink.jsx";


export default function NavMenu({ onClick }) {

  return (
    <ul className="flex justify-center items-center text-sm md:text-base lg:text-xl">
      <NavLink href="#home" onClick={onClick}>
        Home
      </NavLink>
      <NavLink href="#about" onClick={onClick}>
        About
      </NavLink>
      <NavLink href="#strukture" onClick={onClick}>
        Strukture
      </NavLink>
      <NavLink href="#program" onClick={onClick}>
        Program
      </NavLink>
      <NavLink href="#purna" onClick={onClick}>
        Purna
      </NavLink>
    </ul>
  );
}
