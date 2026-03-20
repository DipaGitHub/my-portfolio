// src/pages/About.jsx
import { useState, useEffect } from "react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";

const About = ({ userId }) => {
  const [profile, setProfile] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [education, setEducation] = useState(resumeData.education);
  const [experience, setExperience] = useState(resumeData.experience);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = userId ? `?userId=${userId}` : '';
        const [profileRes, skillsRes, educationRes, experienceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile${query}`),
          fetch(`${API_BASE_URL}/skills${query}`),
          fetch(`${API_BASE_URL}/education${query}`),
          fetch(`${API_BASE_URL}/experience${query}`)
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());
        if (educationRes.ok) setEducation(await educationRes.json());
        if (experienceRes.ok) setExperience(await experienceRes.json());
      } catch (err) {
        console.error('Error fetching about data:', err);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div className="page-container">
      <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          About <span style={{ color: "var(--accent-color)" }}>Me</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          Get to know more about my background, technical skills, and professional journey.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        {/* Quick Info */}
        <div className="glass-panel animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>👤</span> Profile Information
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: "var(--text-color)" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: "var(--text-secondary)" }}>Email</span>
              <span style={{ fontWeight: 500 }}>{profile.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: "var(--text-secondary)" }}>Phone</span>
              <span style={{ fontWeight: 500 }}>{profile.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: "var(--text-secondary)" }}>Location</span>
              <span style={{ fontWeight: 500 }}>{profile.location}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: "var(--text-secondary)" }}>Experience</span>
              <span style={{ fontWeight: 500 }}>{profile.experience}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-panel animate-slide-up" style={{ animationDelay: "0.2s" }}>
           <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>💼</span> Professional Summary
          </h2>
          <p style={{ lineHeight: "1.8", color: "var(--text-color)" }}>
            {profile.summary || "A dedicated and experienced full stack developer with a passion for building scalable and maintainable applications."}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="animate-slide-up" style={{ animationDelay: "0.3s", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Technical Arsenal</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {skills.map((category, index) => (
            <div key={index} className="glass-panel" style={{ padding: "1.5rem", transition: "transform 0.3s", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--accent-color)" }}>{category.category}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {category.items.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-color)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 2px 5px var(--shadow)"
                    }}
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience & Education */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
        
        {/* Experience Timeline */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>⛰️</span> Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {experience.map((exp, index) => (
              <div key={index} className="glass-panel" style={{ borderLeft: "4px solid var(--accent-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{exp.role || exp.position}</h3>
                    <div style={{ color: "var(--accent-color)", fontWeight: "500", marginTop: "0.25rem" }}>{exp.company}</div>
                  </div>
                  <span style={{ 
                    background: "var(--bg-color)", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "1rem", 
                    fontSize: "0.8rem", 
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap"
                  }}>
                    {exp.duration}
                  </span>
                </div>
                <ul style={{ paddingLeft: "1.2rem", color: "var(--text-color)", margin: 0, lineHeight: "1.6" }}>
                  {exp.achievements.map((item, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Timeline */}
        <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🎓</span> Education
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {education.map((edu, index) => (
              <div key={index} className="glass-panel" style={{ borderLeft: "4px solid var(--text-secondary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{edu.degree}</h3>
                    <div style={{ color: "var(--text-secondary)", fontWeight: "500", marginTop: "0.25rem" }}>{edu.institution}</div>
                  </div>
                  <span style={{ 
                    background: "var(--bg-color)", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "1rem", 
                    fontSize: "0.8rem", 
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap"
                  }}>
                    {edu.duration}
                  </span>
                </div>
                {edu.grade && (
                  <div style={{ display: 'inline-block', background: 'var(--bg-secondary)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    Grade: <span style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{edu.grade}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
