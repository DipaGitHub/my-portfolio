// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";
import avatarImg from "../assets/avatar.png";
import avatarHalfImg from "../assets/avatarhalflength.png";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";

const Home = () => {
  const [profile, setProfile] = useState(resumeData.personalInfo);
  const [experience, setExperience] = useState(resumeData.experience);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, experienceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`),
          fetch(`${API_BASE_URL}/experience`)
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (experienceRes.ok) setExperience(await experienceRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const latestExp = experience[0] || { position: 'Full Stack Developer', company: 'Independent' };

  return (
    <div className="page-container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
      <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>
        
        {/* Left Content Area */}
        <div className="hero-content" style={{ paddingRight: '2rem' }}>
          <div className="animate-slide-up" style={{ 
            display: 'inline-block',
            padding: '0.4rem 1.25rem', 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '2rem',
            color: 'var(--text-color)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 10px var(--shadow)'
          }}>
            <span style={{ marginRight: '8px' }}>👋</span> Welcome to my portfolio
          </div>
          
          <h1 className="animate-slide-up" style={{ fontSize: '3.8rem', lineHeight: '1.15', marginBottom: '1.5rem', animationDelay: '0.1s' }}>
            Hi, I'm <span style={{ color: 'var(--accent-color)' }}>{profile.name.split(' ')[0]}</span>.<br />
            I build digital <span style={{ color: 'var(--text-secondary)' }}>experiences.</span>
          </h1>

          <div className="animate-slide-up" style={{ height: '70px', marginBottom: '1.5rem', animationDelay: '0.2s' }}>
            <TypeAnimation
              sequence={[
                `${latestExp.position} @ ${latestExp.company}`,
                2000,
                `${profile.title} (${profile.experience} exp)`,
                2000,
                "Turning ideas into scalable software",
                2000,
              ]}
              wrapper="h2"
              cursor={true}
              repeat={Infinity}
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            />
          </div>

          <p className="animate-slide-up" style={{ fontSize: '1.15rem', color: 'var(--text-color)', marginBottom: '2.5rem', lineHeight: 1.7, opacity: 0.85, animationDelay: '0.3s' }}>
            I specialize in full-stack development, creating accessible, user-centric products and highly reliable APIs. Based in {profile.location}.
          </p>
          
          <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', animationDelay: '0.4s' }}>
            <Link to="/projects" className="btn-premium btn-primary">
              View Projects
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/contact" className="btn-premium btn-outline">
              Contact Me
            </Link>
          </div>
        </div>

        {/* Right Image/Graphic Area */}
        <div className="hero-image animate-slide-up" style={{ display: 'flex', justifyContent: 'center', position: 'relative', animationDelay: '0.2s' }}>
          {/* Decorative background blur */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'var(--accent-color)',
            filter: 'blur(100px)',
            opacity: 0.15,
            borderRadius: '50%',
            zIndex: 0,
            transform: 'scale(0.8)'
          }}></div>
          
          <div className="glass-panel" style={{ position: 'relative', zIndex: 1, padding: '1rem', borderRadius: '50%', background: 'var(--bg-secondary)' }}>
            <img
              src={avatarHalfImg}
              alt={profile.name}
              style={{
                width: "350px",
                height: "350px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "4px solid var(--bg-color)"
              }}
            />
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 968px) {
          .home-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2rem !important;
          }
          .hero-content {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-image {
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
