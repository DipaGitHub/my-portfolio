import { useState, useEffect, useRef } from "react";
import {
  Download,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Target,
} from "lucide-react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";
import "../css/Portfolio.css";
import resumeAsset from "../assets/Dipanjali Pramanick-resume.pdf";

const Resume = () => {
  const [activeSection, setActiveSection] = useState("summary");
  const [skillsInView, setSkillsInView] = useState(false);
  const [timelineInView, setTimelineInView] = useState(false);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);
  const [personalInfo, setPersonalInfo] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [experience, setExperience] = useState(resumeData.experience);
  const [education, setEducation] = useState(resumeData.education);
  const [projects, setProjects] = useState(resumeData.projects);

  const techCount = skills.reduce(
    (acc, cat) => acc + (cat.items?.length || 0),
    0,
  );
  const projectsCount = projects?.length || 0;

  // Intersection Observer for animations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, skillRes, expRes, eduRes, projRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/education`),
          fetch(`${API_BASE_URL}/projects`)
        ]);

        if (profRes.ok) setPersonalInfo(await profRes.json());
        if (skillRes.ok) setSkills(await skillRes.json());
        if (expRes.ok) setExperience(await expRes.json());
        if (eduRes.ok) setEducation(await eduRes.json());
        if (projRes.ok) setProjects(await projRes.json());
      } catch (err) {
        console.error('Error fetching resume data:', err);
      }
    };
    fetchData();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === skillsRef.current && entry.isIntersecting) {
            setSkillsInView(true);
          }
          if (entry.target === timelineRef.current && entry.isIntersecting) {
            setTimelineInView(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (skillsRef.current) observer.observe(skillsRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);

    return () => observer.disconnect();
  }, []);

  // PDF Download function
  const downloadPDF = async () => {
    // If a PDF file is provided in the public/ folder (name from resume.json), download it.
    const resumeFileName = personalInfo.resumeFile || "resume.pdf";
    const pdfPath = `${process.env.PUBLIC_URL}/${resumeFileName}`;

    // Prefer the bundled asset (src/assets) if available
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

      // Fallback: try public/ path provided in resume.json
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
      // ignore and fallback to TXT
    }

    // Fallback: create a TXT download when PDF isn't available
    const resumeContent = `DIPANJALI PRAMANICK - RESUME\n\nCONTACT INFORMATION\nEmail: ${personalInfo.email}\nPhone: ${personalInfo.phone}\nLocation: ${personalInfo.location}\n\nPROFESSIONAL SUMMARY\n${personalInfo.summary}\n\nWORK EXPERIENCE\n${experience
      .map(
        (exp) =>
          `\n${exp.position} at ${exp.company}\n${exp.duration} | ${exp.type}\n${exp.achievements
            .map((achievement) => `• ${achievement}`)
            .join("\n")}`,
      )
      .join("\n")}\n\nEDUCATION\n${education
        .map(
          (edu) =>
            `\n${edu.degree}\n${edu.institution} | ${edu.duration} | Grade: ${edu.grade}`,
        )
        .join("\n")}\n\nTECHNICAL SKILLS\n${skills
          .map(
            (category) =>
              `\n${category.category}: ${category.items.map((item) => item.name).join(", ")}`,
          )
          .join("\n")}`;

    const element = document.createElement("a");
    const file = new Blob([resumeContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${personalInfo.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const SkillBar = ({ skill, delay = 0 }) => (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ color: "var(--text-color)", fontSize: "0.9rem" }}>
          {skill.name}
        </span>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
          {skill.level}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "var(--accent-color)",
            width: skillsInView ? `${skill.level}%` : "0%",
            transition: `width 1s ease-out ${delay}ms`,
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );

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
        />
      </div>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div style={{ marginBottom: "1rem" }}>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            SECTIONS
          </h4>
          {[
            { key: "summary", label: "👤 Summary", icon: <User size={16} /> },
            {
              key: "experience",
              label: "💼 Experience",
              icon: <Briefcase size={16} />,
            },
            { key: "skills", label: "🛠️ Skills", icon: <Code size={16} /> },
            {
              key: "education",
              label: "🎓 Education",
              icon: <GraduationCap size={16} />,
            },
            {
              key: "projects",
              label: "🚀 Projects",
              icon: <Target size={16} />,
            },
          ].map((section) => (
            <div
              key={section.key}
              style={{
                padding: "0.5rem",
                fontSize: "0.8rem",
                color:
                  activeSection === section.key
                    ? "var(--accent-color)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                borderLeft:
                  activeSection === section.key
                    ? "3px solid var(--accent-color)"
                    : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onClick={() => setActiveSection(section.key)}
            >
              {section.icon}
              {section.label}
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            QUICK ACTIONS
          </h4>
          <button
            onClick={downloadPDF}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Download size={14} />
            Download Resume
          </button>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>📄 Format: TXT</div>
            <div>📊 Sections: 5</div>
            <div>⚡ Updated: Today</div>
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
          {/* Header Section */}
          <div className="code-block" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h1
                  style={{
                    color: "var(--function-color)",
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {personalInfo.name}
                </h1>
                <h2
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {personalInfo.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    flexWrap: "wrap",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Mail size={16} />
                    {personalInfo.email}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Phone size={16} />
                    {personalInfo.phone}
                  </div>
                  {personalInfo.github && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <ExternalLink size={16} />
                      <a
                        href={`https://github.com/${personalInfo.github}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {personalInfo.github}
                      </a>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <MapPin size={16} />
                    {personalInfo.location}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Briefcase size={16} />
                    {personalInfo.experience}
                  </div>
                </div>
              </div>
              <button
                onClick={downloadPDF}
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Download size={16} />
                Download Resume
              </button>
            </div>
          </div>

          {/* Dynamic Content Based on Active Section */}
          {activeSection === "summary" && (
            <div className="code-block">
              <h3
                style={{ color: "var(--function-color)", marginBottom: "1rem" }}
              >
                <User
                  size={20}
                  style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
                Professional Summary
              </h3>
              <p
                style={{
                  color: "var(--text-color)",
                  fontSize: "1rem",
                  lineHeight: "1.8",
                  marginBottom: "1rem",
                }}
              >
                {personalInfo.summary}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--accent-color)",
                      fontSize: "1.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {personalInfo.experience}
                  </div>
                  <div
                    style={{ color: "var(--text-color)", fontSize: "0.9rem" }}
                  >
                    Years Experience
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--accent-color)",
                      fontSize: "1.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {techCount}
                  </div>
                  <div
                    style={{ color: "var(--text-color)", fontSize: "0.9rem" }}
                  >
                    Technologies
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--accent-color)",
                      fontSize: "1.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {projectsCount}
                  </div>
                  <div
                    style={{ color: "var(--text-color)", fontSize: "0.9rem" }}
                  >
                    Major Projects
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "experience" && (
            <div ref={timelineRef}>
              <h3
                style={{
                  color: "var(--function-color)",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Briefcase size={20} />
                Work Experience Timeline
              </h3>

              <div style={{ position: "relative" }}>
                {/* Timeline Line */}
                <div
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "0",
                    bottom: "0",
                    width: "2px",
                    backgroundColor: "var(--accent-color)",
                    transform: timelineInView ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "top",
                    transition: "transform 1s ease-out",
                  }}
                />

                {experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    style={{
                      position: "relative",
                      paddingLeft: "60px",
                      marginBottom: "3rem",
                      opacity: timelineInView ? 1 : 0,
                      transform: timelineInView
                        ? "translateX(0)"
                        : "translateX(-20px)",
                      transition: `opacity 0.6s ease-out ${index * 200
                        }ms, transform 0.6s ease-out ${index * 200}ms`,
                    }}
                  >
                    {/* Timeline Dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "10px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--accent-color)",
                        borderRadius: "50%",
                        border: "4px solid var(--bg-color)",
                        boxShadow: "0 0 0 2px var(--accent-color)",
                      }}
                    />

                    <div className="code-block">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              color: "var(--keyword-color)",
                              margin: 0,
                              fontSize: "1.2rem",
                            }}
                          >
                            {exp.position}
                          </h4>
                          <p
                            style={{
                              color: "var(--variable-color)",
                              margin: "0.5rem 0",
                              fontSize: "0.9rem",
                            }}
                          >
                            {exp.company} • {exp.location}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              backgroundColor:
                                exp.type === "Full-time"
                                  ? "var(--string-color)"
                                  : "var(--variable-color)",
                              color: "white",
                              padding: "0.3rem 0.8rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {exp.type}
                          </span>
                          <div
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.8rem",
                              marginTop: "0.5rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Calendar size={14} />
                            {exp.duration}
                          </div>
                        </div>
                      </div>

                      <ul
                        style={{
                          color: "var(--text-color)",
                          fontSize: "0.9rem",
                          paddingLeft: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            style={{
                              marginBottom: "0.5rem",
                              lineHeight: "1.5",
                            }}
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--accent-color)",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "skills" && (
            <div ref={skillsRef}>
              <h3
                style={{
                  color: "var(--function-color)",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Code size={20} />
                Technical Skills & Proficiency
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem",
                }}
              >
                {skills.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="code-block">
                    <h4
                      style={{
                        color: "var(--keyword-color)",
                        marginBottom: "1.5rem",
                        fontSize: "1.1rem",
                      }}
                    >
                      {category.category}
                    </h4>
                    {category.items.map((skill, skillIndex) => (
                      <SkillBar
                        key={skillIndex}
                        skill={skill}
                        delay={categoryIndex * 200 + skillIndex * 100}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div>
              <h3
                style={{
                  color: "var(--function-color)",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <GraduationCap size={20} />
                Educational Background
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {education.map((edu, index) => (
                  <div key={index} className="code-block">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: "var(--keyword-color)",
                            margin: 0,
                            fontSize: "1.1rem",
                          }}
                        >
                          {edu.degree}
                        </h4>
                        <p
                          style={{
                            color: "var(--variable-color)",
                            margin: "0.5rem 0",
                            fontSize: "0.9rem",
                          }}
                        >
                          {edu.institution}
                        </p>
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            margin: 0,
                            fontSize: "0.8rem",
                          }}
                        >
                          {edu.type}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            backgroundColor: "var(--string-color)",
                            color: "white",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {edu.grade}
                        </div>
                        <div
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {edu.duration}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5
                        style={{
                          color: "var(--function-color)",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Key Highlights:
                      </h5>
                      <ul
                        style={{
                          color: "var(--text-color)",
                          fontSize: "0.8rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        {edu.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} style={{ marginBottom: "0.3rem" }}>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div>
              <h3
                style={{
                  color: "var(--function-color)",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Target size={20} />
                Featured Projects
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {projects.map((project, index) => (
                  <div key={index} className="code-block">
                    <h4
                      style={{
                        color: "var(--keyword-color)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {project.title}
                    </h4>
                    <p
                      style={{
                        color: "var(--text-color)",
                        fontSize: "0.9rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {project.description}
                    </p>
                    <div
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        padding: "0.8rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--variable-color)",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        Tech Stack:
                      </div>
                      <div
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8rem",
                          marginTop: "0.3rem",
                        }}
                      >
                        {project.tech}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div>
            <span>📄 resume.jsx</span>
            <span style={{ marginLeft: "1rem" }}>Interactive Resume</span>
            <span style={{ marginLeft: "1rem" }}>UTF-8</span>
          </div>
          <div>
            <span>Section: {activeSection}</span>
            <span style={{ marginLeft: "1rem" }}>🎯 Ready to download</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
