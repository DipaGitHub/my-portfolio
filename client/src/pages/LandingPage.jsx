import { Link } from 'react-router-dom';
import { Rocket, Target, Users, Shield, ArrowRight } from 'lucide-react';
import '../css/Portfolio.css';

const LandingPage = () => {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 5% 4rem', 
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.1), transparent)'
      }}>
        <div className="animate-slide-up" style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1rem', 
          background: 'var(--bg-secondary)', 
          borderRadius: '2rem',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          ✨ The modern way to manage professional portfolios
        </div>
        <h1 className="animate-slide-up" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Professional <span style={{ color: 'var(--accent-color)' }}>Portfolio</span><br />
          Management System
        </h1>
        <p className="animate-slide-up" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          A platform for individuals and organizations to build, showcase, and track professional impact. Deploy beautiful portfolios in seconds.
        </p>
        <div className="animate-slide-up" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/admin/register" className="btn-premium btn-primary" style={{ padding: '1rem 2.5rem' }}>
            Get Started Free <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </Link>
          <Link to="/admin/login" className="btn-premium btn-outline" style={{ padding: '1rem 2.5rem' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem' }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}><Rocket size={40} /></div>
            <h3>Rapid Deployment</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Choose from premium templates and launch your professional presence instantly.</p>
          </div>
          <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', animationDelay: '0.1s' }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}><Target size={40} /></div>
            <h3>Dynamic Interaction</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Recruiters and visitors can interact directly with your interactive AI features.</p>
          </div>
          <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', animationDelay: '0.2s' }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}><Users size={40} /></div>
            <h3>Multi-User Privacy</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Strict data isolation ensures your information remains secure and private.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
