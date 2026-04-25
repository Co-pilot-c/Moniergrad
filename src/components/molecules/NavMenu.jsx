import NavLink from "../atoms/NavLink.jsx";

export default function NavMenu() {
    return (
        <ul className="flex justify-center items-center gap-2 sm:gap-3 md:gap-5 text-white text-xs sm:text-sm md:text-base">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#strukture">Strukture</NavLink>
            <NavLink href="#program">Program</NavLink>
            <NavLink href="#purna">Purna</NavLink>
        
        </ul>
    )
}