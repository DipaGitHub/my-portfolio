import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Palette, ListChecks, ArrowRight, ArrowLeft, Save, Rocket } from 'lucide-react';
import API_BASE_URL from '../../config';

const PortfolioWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    templateId: 'modern-v1',
    sections: ['about', 'skills', 'projects', 'experience', 'education', 'contact'],
    resumeFile: null,
    sourceMode: 'manual' // 'manual' or 'resume'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('templateId', formData.templateId);
      formDataToSend.append('sections', JSON.stringify(formData.sections));
      
      if (formData.resumeFile) {
        formDataToSend.append('resume', formData.resumeFile);
      }

      const res = await fetch(`${API_BASE_URL}/portfolios`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: formDataToSend
      });
      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create portfolio');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'modern-v1', name: 'Modern Professional', desc: 'Clean, dark-themed professional layout.' },
    { id: 'minimal-v1', name: 'Minimalist Clean', desc: 'Light-themed focusing on typography.' },
    { id: 'gradient-v1', name: 'Gradient Glass', desc: 'Vibrant colors with heavy blurs.' },
    { id: 'corporate-v1', name: 'Classic Corporate', desc: 'Structured, formal business look.' }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Create Your <span style={{ color: 'var(--accent-color)' }}>Portfolio</span></h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: step === s ? 'var(--accent-color)' : (step > s ? 'var(--text-secondary)' : 'var(--bg-secondary)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layout size={24} /> Basic Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Portfolio Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g., John's Engineering Portfolio"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Public URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '0 1rem', background: 'var(--bg-secondary)', height: '50px', display: 'flex', alignItems: 'center', borderRadius: '8px 0 0 8px', border: '1px solid var(--border-color)', borderRight: 'none' }}>
                    myportfolio.com/
                  </span>
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ borderRadius: '0 8px 8px 0' }}
                    placeholder="john-doe"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Palette size={24} /> Select Template
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {templates.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setFormData({...formData, templateId: t.id})}
                  className="glass-panel" 
                  style={{ 
                    padding: '1.5rem', 
                    cursor: 'pointer',
                    border: formData.templateId === t.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: formData.templateId === t.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-secondary)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>{t.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ListChecks size={24} /> Portfolio Sections
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['about', 'skills', 'projects', 'experience', 'education', 'contact'].map(sec => (
                <label key={sec} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: formData.sections.includes(sec) ? '1px solid var(--accent-color)' : '1px solid var(--border-color)'
                }}>
                  <input 
                    type="checkbox" 
                    checked={formData.sections.includes(sec)}
                    onChange={() => {
                      const newSecs = formData.sections.includes(sec) 
                        ? formData.sections.filter(s => s !== sec)
                        : [...formData.sections, sec];
                      setFormData({...formData, sections: newSecs});
                    }}
                  />
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Save size={24} /> Resume Integration (Optional)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                Upload your resume to link it to this portfolio. Visitors will be able to download it directly from your site.
              </p>
              
              <div 
                style={{ 
                  border: '2px dashed var(--border-color)', 
                  padding: '4rem 2rem', 
                  borderRadius: '16px', 
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                onClick={() => document.getElementById('resume-upload').click()}
              >
                <input 
                  type="file" 
                  id="resume-upload" 
                  hidden 
                  onChange={e => setFormData({...formData, resumeFile: e.target.files[0]})}
                  accept=".pdf,.doc,.docx"
                />
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                  {formData.resumeFile ? '📄' : '📤'}
                </div>
                {formData.resumeFile ? (
                  <div style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '1.1rem' }}>
                    {formData.resumeFile.name}
                  </div>
                ) : (
                  <>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PDF or Word documents (Max 10MB)</p>
                  </>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  You can also add or change your resume later from your profile settings.
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <button 
            onClick={handleBack} 
            className="btn-premium btn-outline" 
            style={{ visibility: step === 1 ? 'hidden' : 'visible', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 1 && !formData.title}
              className="btn-premium btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn-premium btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Creating...' : 'Launch Portfolio'} <Rocket size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioWizard;
