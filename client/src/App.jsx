// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./css/Portfolio.css";

import LandingPage from "./pages/LandingPage";
import PublicPortfolio from "./pages/PublicPortfolio";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/Admin/Login";
import AdminRegister from "./pages/Admin/Register";
import AdminDashboard from "./pages/Admin/Dashboard";
import PortfolioWizard from "./pages/Admin/PortfolioWizard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-color)",
          }}
        >
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/wizard" element={<PortfolioWizard />} />
              <Route path="/:username/*" element={<PublicPortfolio />} />
              {/* Optional: keeps old routes valid for testing /:username logic */}
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
