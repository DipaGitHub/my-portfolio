import { useState, useRef, useEffect } from "react";
import resumeData from "../data/resume.json";
import "../css/Portfolio.css";

const Contact = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm Dipanjali's AI assistant. I can help you with information about her experience, skills, projects, or contact details. What would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(resumeData.personalInfo);
  const [skills, setSkills] = useState(resumeData.skills);
  const [experience, setExperience] = useState(resumeData.experience);
  const [projects, setProjects] = useState(resumeData.projects);
  const [education, setEducation] = useState(resumeData.education);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, skillRes, expRes, projRes, eduRes] = await Promise.all([
          fetch('http://localhost:5000/api/profile'),
          fetch('http://localhost:5000/api/skills'),
          fetch('http://localhost:5000/api/experience'),
          fetch('http://localhost:5000/api/projects'),
          fetch('http://localhost:5000/api/education')
        ]);

        if (profRes.ok) setProfile(await profRes.json());
        if (skillRes.ok) setSkills(await skillRes.json());
        if (expRes.ok) setExperience(await expRes.json());
        if (projRes.ok) setProjects(await projRes.json());
        if (eduRes.ok) setEducation(await eduRes.json());
      } catch (err) {
        console.error('Error fetching contact data:', err);
      }
    };
    fetchData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    skills: skills
      .map((c) => `${c.category}: ${c.items.map((i) => i.name).join(", ")}`)
      .join("\n"),
    experience: experience
      .map((e) => `${e.position} at ${e.company} (${e.duration})`)
      .join("\n"),
    projects: projects
      .map((p) => `${p.title} — ${p.tech || p.techs || ""}`)
      .join("\n"),
    education: education
      .map((e) => `${e.degree} — ${e.institution} (${e.duration})`)
      .join("\n"),
    contact: `Email: ${profile.email}, Phone: ${profile.phone}, Location: ${profile.location}`,
    availability: "Currently employed but open to relevant opportunities.",
    specialization:
      "ERP systems, Authentication & Security, PDF Automation, Multilingual Apps, Payment Integration, API Optimization",
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (
      message.includes("skill") ||
      message.includes("technology") ||
      message.includes("tech stack")
    ) {
      return knowledgeBase.skills;
    }
    if (
      message.includes("experience") ||
      message.includes("work") ||
      message.includes("job")
    ) {
      return knowledgeBase.experience;
    }
    if (
      message.includes("project") ||
      message.includes("portfolio") ||
      message.includes("work samples")
    ) {
      return knowledgeBase.projects;
    }
    if (
      message.includes("education") ||
      message.includes("degree") ||
      message.includes("qualification")
    ) {
      return knowledgeBase.education;
    }
    if (
      message.includes("contact") ||
      message.includes("email") ||
      message.includes("phone") ||
      message.includes("reach")
    ) {
      return knowledgeBase.contact;
    }
    if (
      message.includes("available") ||
      message.includes("hire") ||
      message.includes("opportunity")
    ) {
      return knowledgeBase.availability;
    }
    if (
      message.includes("specialize") ||
      message.includes("expert") ||
      message.includes("focus")
    ) {
      return knowledgeBase.specialization;
    }
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "Hello! I'm here to help you learn more about Dipanjali's background and expertise. Feel free to ask about her skills, projects, or experience!";
    }

    return "I'd be happy to help! You can ask me about Dipanjali's skills, work experience, projects, education, contact information, or availability for new opportunities.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse = {
          type: "bot",
          content: generateAIResponse(inputValue),
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Thank you for your message! I'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Connection error. Please try again later.");
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
            CONTACT INFO
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              📧 {profile.email}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              📱 {profile.phone}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              📍 {profile.location}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              💼 {profile.experience} experience
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            SOCIAL LINKS
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {profile.github && (
              <div style={{ marginBottom: "0.5rem" }}>
                🐱{" "}
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.github}
                </a>
              </div>
            )}
            {profile.linkedin && (
              <div style={{ marginBottom: "0.5rem" }}>
                💼{" "}
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.linkedin}
                </a>
              </div>
            )}
            <div style={{ marginBottom: "0.5rem" }}>📄 Resume</div>
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
            AI ASSISTANT
          </h4>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div>🤖 Chat for quick info</div>
            <div>⚡ Instant responses</div>
            <div>📋 Available 24/7</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            fontFamily:
              "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          }}
        >
          {/* AI Chat Section */}
          <div
            className="code-block"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "600px",
            }}
          >
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              🤖 AI Assistant Chat
            </h2>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      message.type === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      backgroundColor:
                        message.type === "user"
                          ? "var(--accent-color)"
                          : "var(--bg-color)",
                      color:
                        message.type === "user" ? "white" : "var(--text-color)",
                      border:
                        message.type === "bot"
                          ? "1px solid var(--border-color)"
                          : "none",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem" }}>{message.content}</div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.7,
                        marginTop: "0.3rem",
                        textAlign: message.type === "user" ? "right" : "left",
                      }}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-color)",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="comment">// AI is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me about Dipanjali's experience, skills, or projects..."
                style={{
                  flex: 1,
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                }}
              />
              <button
                onClick={handleSendMessage}
                className="btn btn-primary"
                style={{ padding: "0.8rem 1.5rem" }}
                disabled={!inputValue.trim()}
              >
                Send
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="code-block">
            <h2
              style={{ color: "var(--function-color)", marginBottom: "1rem" }}
            >
              📬 Get In Touch
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "var(--keyword-color)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                onClick={handleFormSubmit}
                className="btn btn-primary"
                style={{ alignSelf: "flex-start", padding: "0.8rem 2rem" }}
              >
                📤 Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div>
            <span>📞 contact.jsx</span>
            <span style={{ marginLeft: "1rem" }}>AI-Powered</span>
            <span style={{ marginLeft: "1rem" }}>UTF-8</span>
          </div>
          <div>
            <span>🤖 AI Assistant Active</span>
            <span style={{ marginLeft: "1rem" }}>Response Rate: ~2s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
