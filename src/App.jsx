import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./landing/Dashboard";
import Profile from "./landing/Profile";

function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
