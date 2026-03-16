import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  User as UserIcon, 
  Rocket, 
  Settings, 
  Briefcase, 
  GraduationCap, 
  LogOut, 
  Trash2, 
  Plus, 
  CheckCircle, 
  UserPlus,
  Layout,
  ExternalLink,
  Clock
} from 'lucide-react';
import API_BASE_URL from '../../config';
import '../../css/Portfolio.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [activeTab, setActiveTab] = useState('portfolios');
  const [loading, setLoading] = useState(true);
  const [resumeToUpload, setResumeToUpload] = useState(null);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAllData(token);
  }, [navigate]);

  const fetchAllData = async (token) => {
    setLoading(true);
    try {
      const results = await Promise.all([
        fetch(`${API_BASE_URL}/auth/user`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/messages`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/profile`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/skills`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/projects`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/education`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/experience`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/portfolios/my`, { headers: { 'x-auth-token': token } })
      ]);

      const [userRes, msgRes, profRes, skillRes, projRes, eduRes, expRes, portRes] = results;

      if (userRes.status === 401 || msgRes.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData);
        if (userData.isAdmin) {
          const usersRes = await fetch(`${API_BASE_URL}/users`, { headers: { 'x-auth-token': token } });
          if (usersRes.ok) setUsers(await usersRes.json());
        }
      }

      if (msgRes.ok) setMessages(await msgRes.json());
      if (profRes.ok) setProfile(await profRes.json());
      if (skillRes.ok) setSkills(await skillRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (eduRes.ok) setEducation(await eduRes.json());
      if (expRes.ok) setExperience(await expRes.json());
      if (portRes && portRes.ok) setPortfolios(await portRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      alert('Error deleting message');
    }
  };

  const approveUser = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/users/approve/${id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      alert('Error approving user');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    
    if (resumeToUpload) {
      formData.append('resume', resumeToUpload);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setResumeToUpload(null);
        alert('Profile updated successfully!');
        fetchAllData(token);
      } else {
        const error = await res.json();
        alert(error.message || 'Error updating profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Server error updating profile');
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const deleteItem = async (section, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${section.slice(0, -1)}?`)) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/${section}/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
      else alert('Failed to delete item');
    } catch (err) {
      alert('Error deleting item');
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  const handleAddItem = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    let data = Object.fromEntries(formData.entries());
    
    // Format data based on section
    if (activeTab === 'projects' && data.technologies) {
      data.technologies = data.technologies.split(',').map(s => s.trim());
    }

    if (activeTab === 'skills') {
      data = {
        category: data.category,
        items: [{ name: data.name, level: 80 }] // Default level for now
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${activeTab}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setShowAddModal(false);
        e.target.reset();
        fetchAllData(token);
      } else {
        const err = await res.json();
        alert(err.message || 'Error adding item');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setAddLoading(false);
    }
  };

  const tabs = [
    { id: 'portfolios', label: 'Portfolios', icon: <Layout size={18} />, count: portfolios.length },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} />, count: messages.length },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Rocket size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Settings size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  ];

  if (currentUser?.isAdmin) {
    tabs.push({ id: 'users', label: 'User Management', icon: <UserPlus size={18} />, count: users.filter(u => !u.isApproved).length });
  }

  if (loading && !profile) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div className="comment" style={{ fontSize: '1.2rem' }}>// Initializing Admin Suite...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Premium Sidebar */}
      <div style={{ 
        width: '280px', 
        background: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--accent-color)' }}>Admin</span> Dashboard
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Portfolio Management System</p>
        </div>

        {portfolios.some(p => p.status === 'published') && (
           <a 
             href={`/${portfolios.find(p => p.status === 'published').slug}`}
             target="_blank"
             rel="noreferrer"
             className="btn-premium btn-outline"
             style={{ width: '100%', marginBottom: '1rem', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textDecoration: 'none' }}
           >
             <ExternalLink size={18} /> View My Public Site
           </a>
        )}

        <button 
          onClick={() => navigate('/admin/wizard')}
          className="btn-premium btn-primary"
          style={{ width: '100%', marginBottom: '2rem', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          <Layout size={18} /> Create Portfolio
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            >
              {tab.icon}
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{ 
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-color)', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem' 
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            marginTop: '2rem',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            color: '#ef4444',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem', maxWidth: '1200px' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.2rem' }}>{tabs.find(t => t.id === activeTab).label}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Manage your portfolio's {activeTab} information.
            </p>
          </div>
          {activeTab !== 'profile' && activeTab !== 'messages' && activeTab !== 'users' && (
             <button 
               className="btn-premium btn-primary" 
               style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
               onClick={() => {
                 if (activeTab === 'portfolios') navigate('/admin/wizard');
                 else setShowAddModal(true);
               }}
             >
                <Plus size={18} /> Add New
             </button>
          )}
        </header>

        <div className="glass-panel animate-slide-up" style={{ padding: '2rem', minHeight: '500px' }}>
          {activeTab === 'portfolios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {portfolios.map(p => (
                  <div key={p._id} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        background: p.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: p.status === 'published' ? '#10b981' : '#f59e0b',
                        border: p.status === 'published' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        {p.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                      {window.location.host}/{p.slug}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <a 
                        href={`/${p.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-premium btn-outline" 
                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <ExternalLink size={14} /> View
                      </a>
                      {p.status === 'draft' && (
                        <button 
                          className="btn-premium btn-primary"
                          style={{ flex: 1, padding: '0.6rem' }}
                          onClick={async () => {
                            const token = localStorage.getItem('adminToken');
                            await fetch(`${API_BASE_URL}/portfolios/${p._id}/publish`, {
                              method: 'PUT',
                              headers: { 'x-auth-token': token }
                            });
                            fetchAllData(token);
                          }}
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {portfolios.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                    <Layout size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No portfolios created yet. Launch your first one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                   <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                   <p>No messages yet. They will appear here when users contact you.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg) => (
                    <div key={msg._id} className="glass-panel" style={{ 
                      padding: '1.5rem', 
                      background: 'var(--bg-color)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'none'
                    }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                           <UserIcon size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <h4 style={{ margin: 0 }}>{msg.name}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <Clock size={14} /> {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '2rem' }}>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Subject</div>
                           <div style={{ fontWeight: 500 }}>{msg.subject || 'N/A'}</div>
                        </div>
                        <div style={{ padding: '0 2rem' }}>
                           <span style={{ 
                             padding: '4px 12px', 
                             borderRadius: '20px', 
                             fontSize: '0.75rem', 
                             fontWeight: 600,
                             background: msg.status === 'new' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                             color: msg.status === 'new' ? 'var(--accent-color)' : 'var(--text-secondary)',
                             textTransform: 'uppercase'
                           }}>
                             {msg.status}
                           </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                         <button className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                           <ExternalLink size={18} />
                         </button>
                         <button 
                           onClick={() => deleteMessage(msg._id)}
                           style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', background: 'transparent', cursor: 'pointer' }}
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                   <UserPlus size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                   <p>No other users registered yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {users.map((user) => (
                    <div key={user._id} className="glass-panel" style={{ 
                      padding: '1.5rem', 
                      background: 'var(--bg-color)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'none'
                    }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                           <UserIcon size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <h4 style={{ margin: 0 }}>{user.username} {user.isAdmin && <span style={{ fontSize: '0.7rem', background: 'var(--accent-color)', color: 'white', padding: '1px 6px', borderRadius: '4px', marginLeft: '0.5rem' }}>Super Admin</span>}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</span>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '2rem' }}>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Joined</div>
                           <div style={{ fontWeight: 500 }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ padding: '0 2rem' }}>
                           <span style={{ 
                             padding: '4px 12px', 
                             borderRadius: '20px', 
                             fontSize: '0.75rem', 
                             fontWeight: 600,
                             background: user.isApproved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                             color: user.isApproved ? '#22c55e' : '#ef4444',
                             textTransform: 'uppercase'
                           }}>
                             {user.isApproved ? 'Approved' : 'Pending'}
                           </span>
                        </div>
                      </div>
                      {!user.isAdmin && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                           {!user.isApproved && (
                             <button 
                               onClick={() => approveUser(user._id)}
                               className="btn-premium btn-primary" 
                               style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                             >
                                <CheckCircle size={14} style={{ marginRight: '0.5rem' }} /> Approve
                             </button>
                           )}
                           <button 
                             onClick={() => deleteUser(user._id)}
                             style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', background: 'transparent', cursor: 'pointer' }}
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && profile && (
             <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                   {['name', 'title', 'email', 'phone', 'location', 'experience', 'company', 'github', 'linkedin'].map((field) => (
                      <div key={field}>
                         <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                           {field.replace(/([A-Z])/g, ' $1')}
                         </label>
                         <input 
                           type="text" 
                           className="admin-input" 
                           name={field}
                           defaultValue={profile[field]} 
                           style={{ marginTop: 0 }}
                         />
                      </div>
                   ))}
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                        Resume Document
                      </label>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <input 
                            type="file" 
                            id="profile-resume-upload" 
                            hidden 
                            onChange={e => setResumeToUpload(e.target.files[0])}
                            accept=".pdf,.doc,.docx"
                          />
                          <button 
                            type="button"
                            onClick={() => document.getElementById('profile-resume-upload').click()}
                            className="admin-input"
                            style={{ 
                              marginTop: 0, 
                              textAlign: 'left', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.75rem',
                              background: resumeToUpload ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-secondary)',
                              borderColor: resumeToUpload ? 'var(--accent-color)' : 'var(--border-color)'
                            }}
                          >
                            <Rocket size={16} /> 
                            {resumeToUpload ? resumeToUpload.name : (profile.resumeFile ? 'Change Resume' : 'Upload Resume')}
                          </button>
                        </div>
                        {profile.resumeFile && (
                          <a 
                            href={profile.resumeFile.startsWith('http') ? profile.resumeFile : `${API_BASE_URL.replace('/api', '')}${profile.resumeFile}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="btn-premium btn-outline"
                            style={{ padding: '0 1rem' }}
                            title="Download Current Resume"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                   </div>
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>Summary</label>
                   <textarea name="summary" className="admin-input" rows="6" defaultValue={profile.summary} style={{ marginTop: 0 }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                   {profileUpdateLoading && <span style={{ alignSelf: 'center', color: 'var(--accent-color)', fontSize: '0.9rem' }}>Updating...</span>}
                   <button type="submit" disabled={profileUpdateLoading} className="btn-premium btn-primary">
                     {profileUpdateLoading ? 'Saving...' : 'Update Profile'}
                   </button>
                </div>
             </form>
          )}

          {activeTab === 'projects' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj) => (
                <div key={proj._id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button 
                    onClick={() => deleteItem('projects', proj._id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <h3 style={{ marginBottom: '0.5rem' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{proj.description}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>{proj.technologies?.join(', ')}</div>
                </div>
              ))}
              {projects.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>No projects added yet.</p>}
            </div>
          )}

          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {skills.map((group) => (
                <div key={group._id} className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{group.category}</h3>
                    <button 
                      onClick={() => deleteItem('skills', group._id)}
                      style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {group.items.map((item, idx) => (
                      <span key={idx} style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {skills.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No skills added yet.</p>}
            </div>
          )}

          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {experience.map((exp) => (
                <div key={exp._id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{exp.role}</h3>
                    <p style={{ color: 'var(--accent-color)', margin: '0.25rem 0' }}>{exp.company}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exp.duration}</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>{exp.description}</p>
                  </div>
                  <button 
                    onClick={() => deleteItem('experience', exp._id)}
                    style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', height: 'fit-content' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {experience.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No experience entries added yet.</p>}
            </div>
          )}

          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {education.map((edu) => (
                <div key={edu._id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{edu.degree}</h3>
                    <p style={{ color: 'var(--accent-color)', margin: '0.25rem 0' }}>{edu.school}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{edu.duration}</p>
                  </div>
                  <button 
                    onClick={() => deleteItem('education', edu._id)}
                    style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', height: 'fit-content' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {education.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No education entries added yet.</p>}
            </div>
          )}
        </div>

        {/* Global Action Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
              <h2 style={{ marginBottom: '2rem', textTransform: 'capitalize' }}>Add New {activeTab.slice(0, -1)}</h2>
              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activeTab === 'skills' && (
                  <>
                    <div>
                      <label className="admin-label">Skill Name</label>
                      <input name="name" className="admin-input" required placeholder="e.g. React.js" />
                    </div>
                    <div>
                      <label className="admin-label">Category</label>
                      <input name="category" className="admin-input" required placeholder="e.g. Frontend" />
                    </div>
                  </>
                )}
                {activeTab === 'projects' && (
                  <>
                    <div>
                      <label className="admin-label">Project Title</label>
                      <input name="title" className="admin-input" required placeholder="Project Name" />
                    </div>
                    <div>
                      <label className="admin-label">Description</label>
                      <textarea name="description" className="admin-input" rows="3" required placeholder="What did you build?" />
                    </div>
                    <div>
                      <label className="admin-label">Technologies (comma separated)</label>
                      <input name="technologies" className="admin-input" placeholder="React, Node.js, MongoDB" />
                    </div>
                    <div>
                      <label className="admin-label">Link (Optional)</label>
                      <input name="link" className="admin-input" placeholder="https://..." />
                    </div>
                  </>
                )}
                {(activeTab === 'experience' || activeTab === 'education') && (
                  <>
                    <div>
                      <label className="admin-label">{activeTab === 'experience' ? 'Role' : 'Degree'}</label>
                      <input name={activeTab === 'experience' ? 'role' : 'degree'} className="admin-input" required />
                    </div>
                    <div>
                      <label className="admin-label">{activeTab === 'experience' ? 'Company' : 'School'}</label>
                      <input name={activeTab === 'experience' ? 'company' : 'school'} className="admin-input" required />
                    </div>
                    <div>
                      <label className="admin-label">Duration</label>
                      <input name="duration" className="admin-input" placeholder="e.g. Jan 2022 - Present" required />
                    </div>
                    {activeTab === 'experience' && (
                      <div>
                        <label className="admin-label">Description</label>
                        <textarea name="description" className="admin-input" rows="3" required />
                      </div>
                    )}
                  </>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-premium btn-outline" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" disabled={addLoading} className="btn-premium btn-primary" style={{ flex: 2 }}>
                    {addLoading ? 'Saving...' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
