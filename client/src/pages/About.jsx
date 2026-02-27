// src/pages/About.jsx
import { useState, useEffect } from "react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";
import "../css/Portfolio.css";

const About = () => {
  const [profile, setProfile] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [education, setEducation] = useState(resumeData.education);
  const [experience, setExperience] = useState(resumeData.experience);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, educationRes, experienceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/education`),
          fetch(`${API_BASE_URL}/experience`)
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
  }, []);

  const skillCategories = skills.map((s) => ({
    category: s.category,
    skills: s.items.map((i) => i.name),
    color: "var(--keyword-color)",
  }));

  return (
    <div
      style={{
        backgroundColor: "var(--bg-color)",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
      }}
    >
      {/* Activity Bar */}
      <div className="activity-bar">
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "var(--accent-color)",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        ></div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ marginBottom: "1rem" }}>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            QUICK INFO
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>📧 {profile.email}</div>
            <div>📱 {profile.phone}</div>
            <div>📍 {profile.location}</div>
            <div>💼 {profile.experience} experience</div>
            <div>🏢 {profile.company}</div>
          </div>
        </div>

        <div>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            SPECIALIZATIONS
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>🔧 ERP Systems</div>
            <div>🔐 Authentication & Security</div>
            <div>📄 PDF Generation</div>
            <div>🌐 Multilingual Apps</div>
            <div>💳 Payment Integration</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "2rem",
            backgroundColor: "var(--bg-color)",
            fontFamily:
              "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          }}
        >
          {/* Professional Summary */}
          <div className="code-block" style={{ marginBottom: "2rem" }}>
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              💼 Professional Summary
            </h2>
            <p
              style={{
                color: "var(--text-color)",
                lineHeight: "1.6",
                fontSize: "1rem",
              }}
            >
              <span className="comment">/**</span>
              <br />
              <span className="comment">
                {" "}
                * {profile.summary || "Full Stack Developer"}
              </span>
              <br />
              <span className="comment"> */</span>
            </p>
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              🛠️ Technical Skills
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {skillCategories.map((category, index) => (
                <div key={index} className="code-block">
                  <h3
                    style={{
                      color: category.color,
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                    }}
                  >
                    {category.category}
                  </h3>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-color)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              💼 Work Experience
            </h2>
            {experience.map((exp, index) => (
              <div
                key={index}
                className="code-block"
                style={{ marginBottom: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3 style={{ color: "var(--keyword-color)", margin: 0 }}>
                    {exp.position}
                  </h3>
                  <span
                    style={{
                      backgroundColor: "var(--accent-color)",
                      color: "white",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "3px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {exp.type}
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--variable-color)",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {exp.company} • {exp.duration}
                </p>
                <ul
                  style={{
                    color: "var(--text-color)",
                    fontSize: "0.9rem",
                    paddingLeft: "1rem",
                  }}
                >
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} style={{ marginBottom: "0.3rem" }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              🎓 Education
            </h2>
            {education.map((edu, index) => (
              <div
                key={index}
                className="code-block"
                style={{ marginBottom: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3 style={{ color: "var(--keyword-color)", margin: 0 }}>
                    {edu.degree}
                  </h3>
                  <span
                    style={{
                      backgroundColor: "var(--string-color)",
                      color: "white",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "3px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {edu.grade}
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--variable-color)",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {edu.institution} • {edu.duration}
                </p>
                <p
                  style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
                >
                  {edu.type}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div>
            <span>📄 about.jsx</span>
            <span style={{ marginLeft: "1rem" }}>React</span>
            <span style={{ marginLeft: "1rem" }}>UTF-8</span>
          </div>
          <div>
            <span>{profile.title}</span>
            <span style={{ marginLeft: "1rem" }}>
              {profile.experience} experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
