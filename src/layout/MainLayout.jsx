
import Navbar from "../components/organisms/Navbar.jsx";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    
    </>
  );
}
