import NavLink from "../atoms/NavLink.jsx";

export default function NavMenu() {
    return (
        <ul className="flex gap-5">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#strukture">Strukture</NavLink>
            <NavLink href="#program">Program</NavLink>
            <NavLink href="#purna">Purna</NavLink>
        
        </ul>
    )
}