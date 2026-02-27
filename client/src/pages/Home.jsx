// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";
import avatarImg from "../assets/avatar.png";
import avatarHalfImg from "../assets/avatarhalflength.png";
import resumeData from "../data/resume.json";
import "../css/Portfolio.css";

const Home = () => {
  const [profile, setProfile] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [projectsData, setProjectsData] = useState(resumeData.projects);
  const [experience, setExperience] = useState(resumeData.experience);
  const [currentLine, setCurrentLine] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes, experienceRes] = await Promise.all([
          fetch('http://localhost:5000/api/profile'),
          fetch('http://localhost:5000/api/skills'),
          fetch('http://localhost:5000/api/projects'),
          fetch('http://localhost:5000/api/experience')
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());
        if (projectsRes.ok) setProjectsData(await projectsRes.json());
        if (experienceRes.ok) setExperience(await experienceRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latestExp = experience[0] || { position: 'Full Stack Developer', company: 'Independent' };

  const codeLines = [
    `// Welcome to ${profile.name}`,
    "class FullStackDeveloper {",
    "  constructor() {",
    `    this.name = '${profile.name}';`,
    `    this.role = '${profile.title}';`,
    `    this.company = '${profile.company}';`,
    `    this.experience = '${profile.experience}';`,
    `    this.location = '${profile.location}';`,
    `    this.email = '${profile.email}';`,
    "  }",
    "",
    "  getSkills() {",
    `    return ${JSON.stringify(
      skills.reduce((acc, c) => {
        acc[c.category.toLowerCase()] = c.items.map((i) => i.name);
        return acc;
      }, {}),
    )};`,
    "  }",
    "",
    "  getCurrentWork() {",
    "    return {",
    `      position: '${latestExp.position}',`,
    `      focus: '${profile.focus || 'Full Stack Development'}',`,
    "    };",
    "  }",
    "",
    "  getProjects() {",
    `    return ${JSON.stringify(projectsData.map((p) => p.title))};`,
    "  }",
    "}",
    "",
    `const ${profile.name.split(' ')[0].toLowerCase()} = new FullStackDeveloper();`,
    `console.log(${profile.name.split(' ')[0].toLowerCase()}.getCurrentWork());`,
    `// building scalable solutions since ${experience[experience.length - 1]?.duration?.split(' ').pop() || '2022'} 🚀`,
  ];

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
            EXPLORER
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>📁 portfolio</div>
            <div style={{ marginLeft: "1rem" }}>📁 src</div>
            <div style={{ marginLeft: "2rem" }}>📁 components</div>
            <div style={{ marginLeft: "2rem" }}>📁 pages</div>
            <div style={{ marginLeft: "3rem", color: "var(--accent-color)" }}>
              📄 Home.jsx
            </div>
            <div style={{ marginLeft: "2rem" }}>📁 assets</div>
            <div style={{ marginLeft: "2rem" }}>📄 App.jsx</div>
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
            SKILLS
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>🅰️ Angular</div>
            <div>⚛️ React.js</div>
            <div>🟢 Node.js</div>
            <div>☕ Java Spring Boot</div>
            <div>🍃 MongoDB</div>
            <div>🐬 MySQL</div>
            <div>🔧 Directus</div>
            <div>💳 Stripe API</div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Editor Content */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            backgroundColor: "var(--bg-color)",
            fontFamily:
              "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
            fontSize: "0.95rem",
            lineHeight: "1.6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <img
              src={avatarHalfImg}
              alt={`${profile.name} Avatar`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "1.5rem",
                border: "3px solid var(--accent-color)",
              }}
            />
            <div>
              <h1
                style={{
                  color: "var(--function-color)",
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                Hi, I'm {profile.name}
              </h1>
              <TypeAnimation
                sequence={[
                  `// ${latestExp.position} at ${latestExp.company}`,
                  2000,
                  `// ${profile.title} (${profile.experience} exp)`,
                  2000,
                  "// API & Database Expert",
                  2000,
                ]}
                wrapper="h2"
                cursor={true}
                repeat={Infinity}
                style={{
                  color: "var(--comment-color)",
                  fontSize: "1.2rem",
                  fontWeight: "normal",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "2rem" }}>
            {/* Code Display */}
            <div style={{ flex: 1 }}>
              <div className="code-block">
                <div
                  style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}
                >
                  <div className="line-numbers">
                    {codeLines.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          color:
                            currentLine === index + 1
                              ? "var(--accent-color)"
                              : "var(--text-secondary)",
                          backgroundColor:
                            currentLine === index + 1
                              ? "var(--line-highlight)"
                              : "transparent",
                          padding: "0 0.5rem",
                        }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    {codeLines.map((line, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            currentLine === index + 1
                              ? "var(--line-highlight)"
                              : "transparent",
                          padding: "0 0.5rem",
                        }}
                      >
                        {line.startsWith("//") ? (
                          <span className="comment">{line}</span>
                        ) : line.includes("class") ||
                          line.includes("constructor") ||
                          line.includes("return") ? (
                          <span className="keyword">{line}</span>
                        ) : line.includes("'") ? (
                          <span>
                            {line.replace(
                              /'([^']*)'/g,
                              "<span class=\"string\">'$1'</span>",
                            )}
                          </span>
                        ) : line.includes("this.") ? (
                          <span className="variable">{line}</span>
                        ) : (
                          <span>{line}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal/Output */}
            <div style={{ width: "300px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  $ node about.js
                </h3>
                <div
                  style={{
                    color: "var(--string-color)",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>Company: "{latestExp.company}"</div>
                  <div>Role: "{latestExp.position}"</div>
                  <div>Experience: "{profile.experience}"</div>
                  <div>Focus: "{profile.focus || 'Full Stack Development'}"</div>
                  <div>Specialization: "{profile.specialization || 'Web Technologies'}"</div>
                  <div>Location: "{profile.location}"</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Link to="/projects" className="btn btn-primary">
                  <span className="function">viewProjects()</span>
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  <span className="variable">contact.me</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div>
            <span>⚡ Ready</span>
            <span style={{ marginLeft: "1rem" }}>JavaScript</span>
            <span style={{ marginLeft: "1rem" }}>UTF-8</span>
          </div>
          <div>
            <span>Line {currentLine}, Col 1</span>
            <span style={{ marginLeft: "1rem" }}>🚀 Building the future</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
