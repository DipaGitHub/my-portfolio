// src/pages/Contact.jsx
import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";

const Contact = ({ userId }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm an AI assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
  const [formStatus, setFormStatus] = useState("idle");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = userId ? `?userId=${userId}` : '';
        const [profRes, skillRes, expRes, projRes, eduRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile${query}`),
          fetch(`${API_BASE_URL}/skills${query}`),
          fetch(`${API_BASE_URL}/experience${query}`),
          fetch(`${API_BASE_URL}/projects${query}`),
          fetch(`${API_BASE_URL}/education${query}`)
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
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    skills: skills.map((c) => `${c.category}: ${c.items.map((i) => typeof i === 'string' ? i : i.name).join(", ")}`).join("\n"),
    experience: experience.map((e) => `${e.position} at ${e.company} (${e.duration})`).join("\n"),
    projects: projects.map((p) => `${p.title} — ${Array.isArray(p.tech) ? p.tech.join(', ') : (p.tech || p.techs || "")}`).join("\n"),
    education: education.map((e) => `${e.degree} — ${e.institution} (${e.duration})`).join("\n"),
    contact: `Email: ${profile.email}, Phone: ${profile.phone}, Location: ${profile.location}`,
    availability: "Currently employed but open to relevant opportunities.",
    specialization: "ERP systems, Authentication & Security, Multilingual Apps, API Optimization",
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    if (message.includes("skill") || message.includes("technology") || message.includes("tech stack")) return knowledgeBase.skills;
    if (message.includes("experience") || message.includes("work") || message.includes("job")) return knowledgeBase.experience;
    if (message.includes("project") || message.includes("portfolio")) return knowledgeBase.projects;
    if (message.includes("education") || message.includes("degree")) return knowledgeBase.education;
    if (message.includes("contact") || message.includes("email") || message.includes("phone")) return knowledgeBase.contact;
    if (message.includes("available") || message.includes("hire") || message.includes("opportunity")) return knowledgeBase.availability;
    if (message.includes("specialize") || message.includes("expert")) return knowledgeBase.specialization;
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) return `Hello! I'm here to help you learn more about ${profile.name.split(' ')[0]}'s background.`;
    return `I can help with info about ${profile.name.split(' ')[0]}'s skills, experience, projects, or contact details.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        type: "bot",
        content: generateAIResponse(inputValue),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus("submitting");

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, targetUserId: userId })
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch (err) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="page-container">
      <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Get In <span style={{ color: "var(--accent-color)" }}>Touch</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          Have a question or want to work together? Leave a message or chat with my AI assistant.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem" }} className="contact-grid">
        
        {/* Left Side: Contact Info & AI Chat */}
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: "2rem", animationDelay: "0.1s" }}>
          
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--heading-color)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
               Contact Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "var(--text-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "var(--bg-color)", padding: "0.75rem", borderRadius: "50%", color: "var(--accent-color)" }}><Mail size={20} /></div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email</div>
                  <div style={{ fontWeight: 500 }}>{profile.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "var(--bg-color)", padding: "0.75rem", borderRadius: "50%", color: "var(--accent-color)" }}><Phone size={20} /></div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Phone</div>
                  <div style={{ fontWeight: 500 }}>{profile.phone}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "var(--bg-color)", padding: "0.75rem", borderRadius: "50%", color: "var(--accent-color)" }}><MapPin size={20} /></div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Location</div>
                  <div style={{ fontWeight: 500 }}>{profile.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium AI Chat Widget */}
          <div className="glass-panel" style={{ padding: 0, display: "flex", flexDirection: "column", height: "450px", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-color)" }}>
              <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--accent-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--heading-color)" }}>AI Assistant</h4>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span> Online
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", background: "var(--bg-secondary)" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.type === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                  <div style={{ 
                    background: msg.type === "user" ? "var(--accent-color)" : "var(--bg-color)", 
                    color: msg.type === "user" ? "#fff" : "var(--text-color)",
                    padding: "0.8rem 1.2rem", 
                    borderRadius: msg.type === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    border: msg.type === "user" ? "none" : "1px solid var(--border-color)",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    boxShadow: "0 2px 5px var(--shadow)"
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", padding: "0 0.5rem", textAlign: msg.type === "user" ? "right" : "left" }}>
                    {msg.timestamp}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: "flex-start", background: "var(--bg-color)", padding: "0.8rem 1.2rem", borderRadius: "18px 18px 18px 4px", border: "1px solid var(--border-color)", display: "flex", gap: "0.3rem" }}>
                  <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} 
                placeholder="Ask me anything..." 
                style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: "2rem", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-color)", outline: "none" }}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim()}
                style={{ width: "45px", height: "45px", borderRadius: "50%", background: inputValue.trim() ? "var(--accent-color)" : "var(--border-color)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: inputValue.trim() ? "pointer" : "not-allowed", transition: "background 0.3s" }}
              >
                <Send size={18} style={{ marginLeft: "2px" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="glass-panel animate-slide-up" style={{ padding: "3rem", display: "flex", flexDirection: "column", animationDelay: "0.2s" }}>
          <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "var(--heading-color)" }}>Send a Message</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Fill out the form below and I'll get back to you as soon as possible.</p>
          
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-grid">
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-color)", fontSize: "0.95rem", fontWeight: 500 }}>Your Name <span style={{ color: "var(--accent-color)" }}>*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="admin-input" placeholder="John Doe" style={{ background: "transparent" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-color)", fontSize: "0.95rem", fontWeight: 500 }}>Your Email <span style={{ color: "var(--accent-color)" }}>*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="admin-input" placeholder="john@example.com" style={{ background: "transparent" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-color)", fontSize: "0.95rem", fontWeight: 500 }}>Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} className="admin-input" placeholder="Project Inquiry" style={{ background: "transparent" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-color)", fontSize: "0.95rem", fontWeight: 500 }}>Message <span style={{ color: "var(--accent-color)" }}>*</span></label>
              <textarea name="message" value={formData.message} onChange={handleFormChange} required className="admin-input" rows="6" placeholder="Hello, I'd like to talk about..." style={{ resize: "vertical", background: "transparent" }}></textarea>
            </div>

            <button type="submit" disabled={formStatus === "submitting"} className="btn-premium btn-primary" style={{ alignSelf: "flex-start", marginTop: "1rem", minWidth: "150px" }}>
              {formStatus === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {formStatus === "success" && (
              <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", marginTop: "1rem", fontSize: "0.95rem" }}>
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}
            {formStatus === "error" && (
              <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", marginTop: "1rem", fontSize: "0.95rem" }}>
                ⚠ Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
        .typing-dot {
          width: 6px; height: 6px; background: var(--text-secondary); border-radius: 50%;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
