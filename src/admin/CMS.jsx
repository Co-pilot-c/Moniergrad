import { Routes, Route, Navigate } from "react-router-dom";
import CMSLayout from "./CMSLayout.jsx";
import CMSDashboard from "./pages/CMSDashboard.jsx";
import CMSHero from "./pages/CMSHero.jsx";
import CMSNavbar from "./pages/CMSNavbar.jsx";
import CMSAbout from "./pages/CMSAbout.jsx";
import CMSStats from "./pages/CMSStats.jsx";
import CMSAngkatan from "./pages/CMSAngkatan.jsx";
import CMSProgram from "./pages/CMSProgram.jsx";
import CMSPurna from "./pages/CMSPurna.jsx";
import CMSCTA from "./pages/CMSCTA.jsx";
import CMSFooter from "./pages/CMSFooter.jsx";
import CMSSettings from "./pages/CMSSettings.jsx";

export default function CMS() {
  return (
    <CMSLayout>
      <Routes>
        <Route index element={<CMSDashboard />} />
        <Route path="hero" element={<CMSHero />} />
        <Route path="navbar" element={<CMSNavbar />} />
        <Route path="about" element={<CMSAbout />} />
        <Route path="stats" element={<CMSStats />} />
        <Route path="angkatan" element={<CMSAngkatan />} />
        <Route path="program" element={<CMSProgram />} />
        <Route path="purna" element={<CMSPurna />} />
        <Route path="cta" element={<CMSCTA />} />
        <Route path="footer" element={<CMSFooter />} />
        <Route path="settings" element={<CMSSettings />} />
        <Route path="*" element={<Navigate to="/11.043-11.044" replace />} />
      </Routes>
    </CMSLayout>
  );
}
