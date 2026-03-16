// src/pages/Projects.jsx
import { useState, useEffect } from "react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";

const Projects = ({ userId }) => {
  const [filterTech, setFilterTech] = useState("all");
  const [projectsData, setProjectsData] = useState(resumeData.projects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = userId ? `?userId=${userId}` : '';
        const res = await fetch(`${API_BASE_URL}/projects${query}`);
        if (res.ok) setProjectsData(await res.json());
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, [userId]);

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
    <div className="page-container">
      <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Selected <span style={{ color: "var(--accent-color)" }}>Projects</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          A showcase of my recent work, highlighting scalable architecture and modern user experiences.
        </p>
      </div>

      {/* Modern Filter Ribbon */}
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem', animationDelay: "0.1s" }}>
        {techStack.map((tech) => (
          <button
            key={tech}
            onClick={() => setFilterTech(tech)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "2rem",
              border: filterTech === tech ? "2px solid var(--accent-color)" : "1px solid var(--border-color)",
              background: filterTech === tech ? "transparent" : "var(--glass-bg)",
              color: filterTech === tech ? "var(--text-color)" : "var(--text-secondary)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: filterTech === tech ? "none" : "0 2px 8px var(--shadow)"
            }}
            onMouseEnter={(e) => {
               if (filterTech !== tech) {
                 e.currentTarget.style.color = "var(--text-color)";
                 e.currentTarget.style.transform = "translateY(-2px)";
               }
            }}
            onMouseLeave={(e) => {
               if (filterTech !== tech) {
                 e.currentTarget.style.color = "var(--text-secondary)";
                 e.currentTarget.style.transform = "translateY(0)";
               }
            }}
          >
            {tech === "all" ? "All Projects" : tech}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid-cards animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="glass-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 35px var(--shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px var(--shadow)';
            }}
          >
            {/* Status Badge */}
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
              <span style={{
                background: project.status === "Production" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                color: project.status === "Production" ? "#10b981" : "#f59e0b",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                border: project.status === "Production" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                {project.status}
              </span>
            </div>

            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", paddingRight: "60px", color: "var(--heading-color)" }}>
              {project.title}
            </h3>
            
            <p style={{ color: "var(--text-color)", flexGrow: 1, marginBottom: "1.5rem", lineHeight: "1.6" }}>
              {project.description}
            </p>

            {project.features && project.features.length > 0 && (
              <ul style={{ 
                paddingLeft: "1.2rem", 
                marginBottom: "1.5rem", 
                color: "var(--text-secondary)", 
                fontSize: "0.9rem",
                listStyleType: "circle"
              }}>
                {project.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>{feature}</li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  style={{
                    background: "var(--bg-color)",
                    color: "var(--accent-color)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    border: "1px solid var(--border-color)"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-outline"
                  style={{ flex: 1, padding: "0.6rem 1rem", fontSize: "0.9rem" }}
                >
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-primary"
                  style={{ flex: 1, padding: "0.6rem 1rem", fontSize: "0.9rem" }}
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
