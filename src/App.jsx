import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./landing/Dashboard";
import Profile from "./landing/Profile";
import Login from "./admin/Login.jsx";
import CMS from "./admin/CMS.jsx";

function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* CMS Routes - Hidden from public navigation */}
        <Route path="/11.043-11.044/login" element={<Login />} />
        <Route path="/11.043-11.044/*" element={<CMS />} />
      </Routes>
    </>
  );
}

export default App;
