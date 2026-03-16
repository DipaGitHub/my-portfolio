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
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  UserPlus
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
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
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
      const [userRes, msgRes, profRes, skillRes, projRes, eduRes, expRes] = await Promise.all([
        fetch(`${API_BASE_URL}/auth/user`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/messages`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/profile`),
        fetch(`${API_BASE_URL}/skills`),
        fetch(`${API_BASE_URL}/projects`),
        fetch(`${API_BASE_URL}/education`),
        fetch(`${API_BASE_URL}/experience`)
      ]);

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

  const tabs = [
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
          {activeTab !== 'profile' && activeTab !== 'messages' && (
             <button className="btn-premium btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <Plus size={18} /> Add New
             </button>
          )}
        </header>

        <div className="glass-panel animate-slide-up" style={{ padding: '2rem', minHeight: '500px' }}>
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
             <form onSubmit={(e) => {
               e.preventDefault();
               alert('Profile update coming soon in the next minor patch!');
             }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                   {['name', 'title', 'email', 'phone', 'location', 'experience', 'company', 'github', 'linkedin', 'resumeFile'].map((field) => (
                      <div key={field}>
                         <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                           {field.replace(/([A-Z])/g, ' $1')}
                         </label>
                         <input 
                           type="text" 
                           className="admin-input" 
                           defaultValue={profile[field]} 
                           style={{ marginTop: 0 }}
                         />
                      </div>
                   ))}
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>Summary</label>
                   <textarea className="admin-input" rows="6" defaultValue={profile.summary} style={{ marginTop: 0 }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                   <button className="btn-premium btn-primary">Update Profile</button>
                </div>
             </form>
          )}

          {activeTab !== 'messages' && activeTab !== 'profile' && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
               <Clock size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
               <p>Content for {activeTab} is being optimized for the new UI.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
