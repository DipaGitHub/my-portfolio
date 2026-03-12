// src/components/Footer.jsx
import resumeData from "../data/resume.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-secondary)",
        padding: "2.5rem 5%",
        fontSize: "0.95rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-color)",
        marginTop: "auto"
      }}
    >
      <div>
        © {currentYear} <strong>{resumeData.personalInfo?.name || "Portfolio"}</strong>. All rights reserved.
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
        <span>React</span>
        <span>•</span>
        <span>Node.js</span>
        <span>•</span>
        <span>Express</span>
      </div>
    </footer>
  );
};

export default Footer;
