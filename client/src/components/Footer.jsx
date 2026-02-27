// src/components/Footer.jsx
import resumeData from "../data/resume.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--status-bar-bg)",
        color: "white",
        padding: "0.5rem 1rem",
        fontSize: "0.8rem",
        fontFamily:
          "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span>© {currentYear} </span>
        <span>{resumeData.personalInfo?.name || "Portfolio"}</span>
        <span>|</span>
        <span>💼 Portfolio v1.0.0</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span>🌐 React</span>
        <span>⚡ JavaScript</span>
        <span>🟢 Node.js</span>
        <span
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "2px 6px",
            borderRadius: "3px",
            fontSize: "0.7rem",
          }}
        >
          Ready
        </span>
      </div>
    </footer>
  );
};

export default Footer;
