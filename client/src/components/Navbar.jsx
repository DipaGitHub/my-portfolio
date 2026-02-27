// src/components/Navbar.jsx
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import resumeData from "../data/resume.json";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/about", label: "About", icon: "👨‍💻" },
    { path: "/projects", label: "Projects", icon: "🚀" },
    { path: "/resume", label: "Resume", icon: "📄" },
    { path: "/contact", label: "Contact", icon: "✉️" },
  ];

  return (
    <div className="vscode-window">
      {/* VS Code Title Bar */}
      <div className="vscode-titlebar">
        <div className="window-controls">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="title">
          {resumeData.personalInfo.name} - Portfolio
        </span>
        <div style={{ marginLeft: "auto" }}>
          {resumeData.personalInfo.github && (
            <a
              href={`https://github.com/${resumeData.personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: 8, color: "var(--text-color)" }}
            >
              🐱
            </a>
          )}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* VS Code Tabs */}
      <div className="tab-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`tab ${location.pathname === item.path ? "active" : ""}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span style={{ marginRight: "8px" }}>{item.icon}</span>
            {item.label}
            {location.pathname === item.path && (
              <span style={{ marginLeft: "8px", opacity: 0.7 }}>●</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
