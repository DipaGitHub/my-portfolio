// Enhanced Projects.jsx
import { useState, useEffect } from "react";
import resumeData from "../data/resume.json";
import "../css/Portfolio.css";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterTech, setFilterTech] = useState("all");
  const [projectsData, setProjectsData] = useState(resumeData.projects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        if (res.ok) setProjectsData(await res.json());
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const projects = (projectsData || []).map((p, idx) => ({
    id: p._id || idx + 1,
    title: p.title,
    description: p.description,
    tech: typeof p.tech === 'string' ? p.tech.split(/[,\s]+/).filter(Boolean) : (p.tech || p.techs || []),
    github: p.github || null,
    demo: p.demo || p.link || null,
    features: p.features || [],
    status: p.status || "Production",
    date: p.date || null,
  }));

  const techStack = Array.from(
    new Set(["all", ...projects.flatMap((p) => p.tech || [])]),
  );

  const filteredProjects =
    filterTech === "all"
      ? projects
      : projects.filter((project) => (project.tech || []).includes(filterTech));

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
            FILTER BY TECH
          </h4>
          <div style={{ fontSize: "0.8rem" }}>
            {techStack.map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "0.3rem 0",
                  color:
                    filterTech === tech
                      ? "var(--accent-color)"
                      : "var(--text-secondary)",
                  cursor: "pointer",
                  borderLeft:
                    filterTech === tech
                      ? "3px solid var(--accent-color)"
                      : "3px solid transparent",
                  paddingLeft: "0.5rem",
                }}
                onClick={() => setFilterTech(tech)}
              >
                {tech === "all" ? "📁 All Projects" : `🔧 ${tech}`}
              </div>
            ))}
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
            PROJECT STATS
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>📊 Total: {projects.length}</div>
            <div>
              🟢 Production:{" "}
              {projects.filter((p) => p.status === "Production").length}
            </div>
            <div>
              🔄 In Development:{" "}
              {projects.filter((p) => p.status === "In Development").length}
            </div>
            <div>⭐ Featured: {projects.length}</div>
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
          <div className="code-block" style={{ marginBottom: "2rem" }}>
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              🚀 Featured Projects
            </h2>
            <p style={{ color: "var(--comment-color)", fontSize: "1rem" }}>
              <span className="comment">
                // A collection of web applications built with modern
                technologies
              </span>
              <br />
              <span className="comment">
                // Focus: Scalable architecture, clean code, and user experience
              </span>
            </p>
          </div>

          {/* Projects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="code-block"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border:
                    selectedProject === project.id
                      ? "2px solid var(--accent-color)"
                      : "1px solid var(--border-color)",
                }}
                onClick={() =>
                  setSelectedProject(
                    selectedProject === project.id ? null : project.id,
                  )
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: "var(--keyword-color)", margin: 0 }}>
                    {project.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          project.status === "Production"
                            ? "var(--string-color)"
                            : "var(--variable-color)",
                        color: "white",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "3px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {project.status}
                    </span>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "1.2rem",
                      }}
                    >
                      {selectedProject === project.id ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

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
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-color)",
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

                {selectedProject === project.id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      borderTop: "1px solid var(--border-color)",
                      paddingTop: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        color: "var(--function-color)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      🔥 Key Features:
                    </h4>
                    <ul
                      style={{
                        color: "var(--text-color)",
                        fontSize: "0.8rem",
                        paddingLeft: "1rem",
                      }}
                    >
                      {project.features.map((feature, index) => (
                        <li key={index} style={{ marginBottom: "0.3rem" }}>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                      >
                        📂 Source Code
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                        >
                          🌐 Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div>
            <span>📁 projects.jsx</span>
            <span style={{ marginLeft: "1rem" }}>TypeScript React</span>
            <span style={{ marginLeft: "1rem" }}>UTF-8</span>
          </div>
          <div>
            <span>{filteredProjects.length} projects shown</span>
            <span style={{ marginLeft: "1rem" }}>Filter: {filterTech}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
