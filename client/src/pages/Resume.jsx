// src/pages/Resume.jsx
import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code
} from "lucide-react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";
import resumeAsset from "../assets/Dipanjali Pramanick-resume.pdf";

const Resume = () => {
  const [personalInfo, setPersonalInfo] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [experience, setExperience] = useState(resumeData.experience);
  const [education, setEducation] = useState(resumeData.education);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, skillRes, expRes, eduRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/education`)
        ]);

        if (profRes.ok) setPersonalInfo(await profRes.json());
        if (skillRes.ok) setSkills(await skillRes.json());
        if (expRes.ok) setExperience(await expRes.json());
        if (eduRes.ok) setEducation(await eduRes.json());
      } catch (err) {
        console.error('Error fetching resume data:', err);
      }
    };
    fetchData();
  }, []);

  const downloadPDF = async () => {
    const resumeFileName = personalInfo.resumeFile || "resume.pdf";
    const pdfPath = `${process.env.PUBLIC_URL}/${resumeFileName}`;

    try {
      if (typeof resumeAsset === "string" && resumeAsset.length > 0) {
        const a = document.createElement("a");
        a.href = resumeAsset;
        a.download = `${personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const res = await fetch(pdfPath, { method: "HEAD" });
      if (res.ok) {
        const a = document.createElement("a");
        a.href = pdfPath;
        a.download = `${personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch (e) {
      // ignore
    }

    const resumeContent = `DIPANJALI PRAMANICK - RESUME\n\nCONTACT INFORMATION\nEmail: ${personalInfo.email}\nPhone: ${personalInfo.phone}\nLocation: ${personalInfo.location}\n\n`;
    const element = document.createElement("a");
    const file = new Blob([resumeContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${personalInfo.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="page-container">
      {/* Resume Header */}
      <div className="glass-panel animate-slide-up" style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem", color: "var(--heading-color)" }}>{personalInfo.name}</h1>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-color)", marginBottom: "1.5rem", fontWeight: 500 }}>{personalInfo.title}</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={16} /> {personalInfo.email}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={16} /> {personalInfo.phone}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={16} /> {personalInfo.location}</div>
            {personalInfo.github && (
              <a href={`https://github.com/${personalInfo.github}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent-color)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                <ExternalLink size={16} /> / {personalInfo.github}
              </a>
            )}
          </div>
        </div>
        
        <button onClick={downloadPDF} className="btn-premium btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Download size={18} /> Download CV
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }} className="resume-grid">
        
        {/* Left Column: Skills & Education */}
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: "3rem", animationDelay: "0.1s" }}>
          
          <section>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--heading-color)" }}>
              <Code size={20} style={{ color: "var(--accent-color)" }} /> Core Skills
            </h3>
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              {skills.map((category, idx) => (
                <div key={idx} style={{ marginBottom: idx !== skills.length - 1 ? "1.5rem" : 0 }}>
                  <h4 style={{ fontSize: "1rem", color: "var(--text-color)", marginBottom: "0.75rem", fontWeight: 600 }}>{category.category}</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {category.items.map((skill, sIdx) => (
                      <span key={sIdx} style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--heading-color)" }}>
              <GraduationCap size={20} style={{ color: "var(--accent-color)" }} /> Education
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {education.map((edu, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "1.5rem", borderLeft: "3px solid var(--accent-color)" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--heading-color)" }}>{edu.degree}</h4>
                  <div style={{ color: "var(--accent-color)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.5rem" }}>{edu.institution}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    <span>{edu.duration}</span>
                    <span>{edu.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Experience */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--heading-color)" }}>
            <Briefcase size={20} style={{ color: "var(--accent-color)" }} /> Professional Experience
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {experience.map((exp, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "2rem", position: "relative" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1.3rem", color: "var(--heading-color)", marginBottom: "0.25rem" }}>{exp.position}</h4>
                    <div style={{ fontSize: "1rem", color: "var(--accent-color)", fontWeight: 500 }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "inline-block", background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                      {exp.type}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-secondary)", fontSize: "0.85rem", justifyContent: "flex-end" }}>
                      <Calendar size={14} /> {exp.duration}
                    </div>
                  </div>
                </div>

                <div style={{ margin: "1.5rem 0", width: "100%", height: "1px", background: "var(--border-color)" }}></div>

                <ul style={{ paddingLeft: "1.2rem", color: "var(--text-color)", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                  {exp.achievements.map((item, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>{item}</li>
                  ))}
                </ul>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" }}>
                    {exp.technologies.map((tech, tIdx) => (
                      <span key={tIdx} style={{ background: "var(--bg-secondary)", color: "var(--accent-color)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid var(--border-color)" }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .resume-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Resume;
