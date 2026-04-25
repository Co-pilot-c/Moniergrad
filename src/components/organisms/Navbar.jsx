import NavMenu from "../molecules/NavMenu";
import logo from "../../assets/vector/logo.png";

export default function Navbar() {
  return (
    <nav className="m-3 sm:m-5 fixed z-50 top-0 left-0 right-0 flex justify-center">
      <div className="px-2 sm:px-4 py-2 flex gap-2 sm:gap-5 bg-sky-400 rounded-full shadow-md max-w-[95%] sm:max-w-none">
        <div className="bg-white rounded-full px-3 sm:px-5 py-2">
          <img src="" alt="" />
          <h1 className="text-sm sm:text-lg font-bold text-gray-900">
            Organisasi<span className="text-sky-500">.</span>
          </h1>
        </div>
        <div className="flex items-center px-2 sm:px-5">
          <NavMenu />
        </div>
      </div>
    </nav>
  );
}
