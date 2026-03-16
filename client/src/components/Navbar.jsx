// src/components/Navbar.jsx
import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import resumeData from "../data/resume.json";
import API_BASE_URL from "../config";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: { 'x-auth-token': token }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data);
          } else {
              // If token invalid, clear it
              localStorage.removeItem('adminToken');
              setCurrentUser(null);
          }
        } catch (err) {
          console.error('Failed to fetch user', err);
        }
      } else {
          setCurrentUser(null);
      }
    };

    fetchUser();
    
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, [location.pathname]); // Re-fetch on route change to catch login/logout

  // Check if on a public portfolio route
  const isPublicView = location.pathname !== '/' && 
                      !location.pathname.startsWith('/admin') && 
                      location.pathname.split('/').length === 2;
  const username = isPublicView ? location.pathname.split('/')[1] : null;

  const navItems = isPublicView ? [
    { path: `/${username}#top`, label: "Home" },
    { path: `/${username}#about`, label: "About" },
    { path: `/${username}#projects`, label: "Projects" },
    { path: `/${username}#contact`, label: "Contact" },
  ] : [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/resume", label: "Resume" },
    { path: "/contact", label: "Contact" },
  ];

  const displayName = currentUser?.name 
    ? currentUser.name.split(' ')[0] 
    : resumeData.personalInfo.name.split(' ')[0];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1.25rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 30px var(--shadow)'
    }}>
      <Link to={isPublicView ? `/${username}` : "/"} style={{ textDecoration: 'none', color: 'var(--heading-color)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
        {displayName}
        <span style={{ color: 'var(--accent-color)' }}>.</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {navItems.map((item) => (
          item.path.startsWith('/#') || (isPublicView && item.path.includes('#')) ? (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                if (isPublicView) {
                  e.preventDefault();
                  const targetId = item.path.split('#')[1];
                  const elem = document.getElementById(targetId);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                textDecoration: "none",
                color: "var(--text-color)",
                fontWeight: 500,
                fontSize: '1rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-color)'}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: location.pathname === item.path ? "var(--accent-color)" : "var(--text-color)",
                fontWeight: location.pathname === item.path ? 600 : 500,
                fontSize: '1rem',
                transition: 'color 0.3s ease'
              }}
            >
              {item.label}
            </Link>
          )
        ))}
        
        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

        {resumeData.personalInfo.github && (
          <a
            href={`https://github.com/${resumeData.personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-color)", display: 'flex', alignItems: 'center', transition: 'color 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-color)'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
        <button
          onClick={toggleTheme}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-color)",
            width: '40px',
            height: '40px',
            borderRadius: "50%",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px var(--shadow)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-color)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px var(--shadow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow)';
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
