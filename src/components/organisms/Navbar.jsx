import NavMenu from "../molecules/NavMenu";
import logo from "../../assets/vector/logo.png";

export default function Navbar() {
  return (
    <nav className="px-5 py-3 m-5 fixed z-50 top-0 left-0 right-0 text-grey-900 bg-white shadow rounded-full">
      <div className="flex justify-between items-center px-5">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <h1 className="font-bold text-1xl cursor-pointer">Organisasi</h1>
        </div>

        {/* NavManu */}
        <NavMenu />
      </div>
    </nav>
  );
}
