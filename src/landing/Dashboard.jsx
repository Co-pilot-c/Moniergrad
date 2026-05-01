import MainLayout from "../layout/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Program from "../pages/Program.jsx";
import Strukture from "../pages/Strukture.jsx";
import Purna from "../pages/Purna.jsx";
import Footer from "../components/organisms/Footer.jsx";

export default function Dashboard() {
  return (
    <MainLayout>
      <Home />
      <About />
      <Strukture />
      <Program />
      <Purna />
      <Footer/>
    </MainLayout>
  );
}
