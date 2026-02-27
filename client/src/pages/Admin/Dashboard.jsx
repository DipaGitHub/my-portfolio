import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import '../../css/Portfolio.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
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
      const [msgRes, profRes, skillRes, projRes, eduRes, expRes] = await Promise.all([
        fetch(`${API_BASE_URL}/messages`, { headers: { 'x-auth-token': token } }),
        fetch(`${API_BASE_URL}/profile`),
        fetch(`${API_BASE_URL}/skills`),
        fetch(`${API_BASE_URL}/projects`),
        fetch(`${API_BASE_URL}/education`),
        fetch(`${API_BASE_URL}/experience`)
      ]);

      if (msgRes.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
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

  const updateProfile = async (updatedData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const addProject = async (projectData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Project added successfully!');
      }
    } catch (err) {
      alert('Error adding project');
    }
  };

  const updateProject = async (id, projectData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Project updated successfully!');
      }
    } catch (err) {
      alert('Error updating project');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Project deleted successfully!');
      }
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const addSkillGroup = async (skillData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(skillData)
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Skill group added!');
      }
    } catch (err) {
      alert('Error adding skill group');
    }
  };

  const updateSkillGroup = async (id, skillData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(skillData)
      });
      if (res.ok) {
        fetchAllData(token);
        setEditingId(null);
        alert('Skill group updated!');
      }
    } catch (err) {
      alert('Error updating skill group');
    }
  };

  const deleteSkillGroup = async (id) => {
    if (!window.confirm('Delete this skill group?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL} / skills / ${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        fetchAllData(token);
      }
    } catch (err) {
      alert('Error deleting skill group');
    }
  };

  const updateExperience = async (id, expData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/experience/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(expData)
      });
      if (res.ok) {
        fetchAllData(token);
        setEditingId(null);
        alert('Experience updated!');
      }
    } catch (err) {
      alert('Error updating experience');
    }
  };

  const addExperience = async (expData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(expData)
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Experience added!');
      }
    } catch (err) {
      alert('Error adding experience');
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  const updateEducation = async (id, eduData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/education/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(eduData)
      });
      if (res.ok) {
        fetchAllData(token);
        setEditingId(null);
        alert('Education updated!');
      }
    } catch (err) {
      alert('Error updating education');
    }
  };

  const addEducation = async (eduData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/education`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(eduData)
      });
      if (res.ok) {
        fetchAllData(token);
        alert('Education added!');
      }
    } catch (err) {
      alert('Error adding education');
    }
  };

  const deleteEducation = async (id) => {
    if (!window.confirm('Delete this education?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/education/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) fetchAllData(token);
    } catch (err) {
      alert('Error deleting education');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
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

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 120px)', display: 'flex' }}>
      {/* Admin Sidebar */}
      <div className="sidebar" style={{ width: '250px' }}>
        <h3 style={{ color: 'var(--function-color)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          ADMIN PANEL
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('messages')}
            className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            📬 Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            👤 Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            🚀 Edit Projects
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            🔧 Edit Skills
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`btn ${activeTab === 'experience' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            💼 Edit Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`btn ${activeTab === 'education' ? 'btn-primary' : 'btn-outline'}`}
            style={{ textAlign: 'left', fontSize: '0.9rem' }}
          >
            🎓 Edit Education
          </button>
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ width: '100%', color: '#ff5555', borderColor: '#ff5555' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ color: 'var(--keyword-color)', marginBottom: '2rem' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
        </h2>

        {activeTab === 'messages' && (
          <div className="code-block" style={{ padding: '1rem' }}>
            {loading ? (
              <div className="comment">// Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="comment">// No messages found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-color)', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.8rem' }}>Name</th>
                    <th style={{ padding: '0.8rem' }}>Email</th>
                    <th style={{ padding: '0.8rem' }}>Subject</th>
                    <th style={{ padding: '0.8rem' }}>Status</th>
                    <th style={{ padding: '0.8rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.8rem' }}>{msg.name}</td>
                      <td style={{ padding: '0.8rem' }}>{msg.email}</td>
                      <td style={{ padding: '0.8rem' }}>{msg.subject || 'N/A'}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{
                          color: msg.status === 'new' ? 'var(--accent-color)' : 'var(--comment-color)',
                          fontWeight: 'bold'
                        }}>
                          {msg.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <button onClick={() => deleteMessage(msg._id)} className="btn btn-outline" style={{ color: '#ff5555', borderColor: '#ff5555', fontSize: '0.7rem' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="code-block" style={{ padding: '2rem' }}>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateProfile(Object.fromEntries(formData));
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="keyword">Name</label>
                  <input type="text" name="name" defaultValue={profile.name} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Title</label>
                  <input type="text" name="title" defaultValue={profile.title} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Email</label>
                  <input type="email" name="email" defaultValue={profile.email} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Phone</label>
                  <input type="text" name="phone" defaultValue={profile.phone} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Location</label>
                  <input type="text" name="location" defaultValue={profile.location} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Experience (Yrs)</label>
                  <input type="text" name="experience" defaultValue={profile.experience} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">Current Company</label>
                  <input type="text" name="company" defaultValue={profile.company} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">GitHub Username</label>
                  <input type="text" name="github" defaultValue={profile.github} className="admin-input" />
                </div>
                <div>
                  <label className="keyword">LinkedIn Username</label>
                  <input type="text" name="linkedin" defaultValue={profile.linkedin} className="admin-input" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="keyword">Summary</label>
                  <textarea name="summary" defaultValue={profile.summary} rows="5" className="admin-input"></textarea>
                </div>
                <div>
                  <label className="keyword">Primary Focus</label>
                  <input type="text" name="focus" defaultValue={profile.focus} className="admin-input" placeholder="e.g. ERP systems & API development" />
                </div>
                <div>
                  <label className="keyword">Specialization</label>
                  <input type="text" name="specialization" defaultValue={profile.specialization} className="admin-input" placeholder="e.g. Angular + Node.js" />
                </div>
                <div>
                  <label className="keyword">Resume Filename</label>
                  <input type="text" name="resumeFile" defaultValue={profile.resumeFile} className="admin-input" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Save Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="code-block" style={{ padding: '1rem' }}>
            {skills.map((group) => (
              <div key={group._id} style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                {editingId === group._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const category = e.target.category.value;
                    const itemsText = e.target.items.value;
                    const items = itemsText.split(',').map(s => {
                      const [name, level] = s.split(':');
                      return { name: name.trim(), level: parseInt(level) || 0 };
                    });
                    updateSkillGroup(group._id, { category, items });
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <input type="text" name="category" defaultValue={group.category} className="admin-input" required />
                      <input type="text" name="items" defaultValue={group.items.map(i => `${i.name}:${i.level} `).join(', ')} className="admin-input" required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Update</button>
                      <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 className="function">{group.category}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setEditingId(group._id)} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Edit</button>
                        <button onClick={() => deleteSkillGroup(group._id)} className="btn btn-outline" style={{ color: '#ff5555', borderColor: '#ff5555', fontSize: '0.7rem' }}>Delete Group</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                      {group.items.map((item, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                          <span className="variable">{item.name}</span>: <span className="string">{item.level}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div style={{ marginTop: '2rem' }}>
              <h4 className="comment">// Add New Skill Group</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const category = e.target.category.value;
                const itemsText = e.target.items.value;
                const items = itemsText.split(',').map(s => {
                  const [name, level] = s.split(':');
                  return { name: name.trim(), level: parseInt(level) || 0 };
                });
                addSkillGroup({ category, items });
                e.target.reset();
              }} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" name="category" placeholder="Category (e.g. Frontend)" className="admin-input" required />
                <input type="text" name="items" placeholder="Items (e.g. React:90, Node:85)" className="admin-input" required />
                <button type="submit" className="btn btn-primary">Add</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="code-block" style={{ padding: '1rem' }}>
            {experience.map((exp) => (
              <div key={exp._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                {editingId === exp._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    data.achievements = data.achievements.split('\n').filter(Boolean);
                    data.technologies = data.technologies.split(',').map(s => s.trim()).filter(Boolean);
                    updateExperience(exp._id, data);
                  }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" name="company" defaultValue={exp.company} className="admin-input" required />
                    <input type="text" name="position" defaultValue={exp.position} className="admin-input" required />
                    <input type="text" name="duration" defaultValue={exp.duration} className="admin-input" required />
                    <input type="text" name="type" defaultValue={exp.type} className="admin-input" required />
                    <input type="text" name="location" defaultValue={exp.location} className="admin-input" />
                    <input type="text" name="technologies" defaultValue={exp.technologies.join(', ')} className="admin-input" />
                    <textarea name="achievements" defaultValue={exp.achievements.join('\n')} className="admin-input" style={{ gridColumn: 'span 2' }} required></textarea>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">Update Experience</button>
                      <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="keyword">{exp.position} @ {exp.company}</h3>
                      <p className="comment">{exp.duration} • {exp.type}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => setEditingId(exp._id)} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Edit</button>
                      <button onClick={() => deleteExperience(exp._id)} className="btn btn-outline" style={{ color: '#ff5555', borderColor: '#ff5555', fontSize: '0.7rem' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <h3 className="function">Add New Experience</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                data.achievements = data.achievements.split('\n').filter(Boolean);
                data.technologies = data.technologies.split(',').map(s => s.trim()).filter(Boolean);
                addExperience(data);
                e.target.reset();
              }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" name="company" placeholder="Company" className="admin-input" required />
                <input type="text" name="position" placeholder="Position" className="admin-input" required />
                <input type="text" name="duration" placeholder="Duration (e.g. 2021 - Present)" className="admin-input" required />
                <input type="text" name="type" placeholder="Type (e.g. Full-time)" className="admin-input" required />
                <input type="text" name="location" placeholder="Location" className="admin-input" />
                <input type="text" name="technologies" placeholder="Technologies (comma separated)" className="admin-input" />
                <textarea name="achievements" placeholder="Achievements (one per line)" className="admin-input" style={{ gridColumn: 'span 2' }} required></textarea>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Experience</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="code-block" style={{ padding: '1rem' }}>
            {education.map((edu) => (
              <div key={edu._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                {editingId === edu._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateEducation(edu._id, Object.fromEntries(formData));
                  }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" name="institution" defaultValue={edu.institution} className="admin-input" required />
                    <input type="text" name="degree" defaultValue={edu.degree} className="admin-input" required />
                    <input type="text" name="duration" defaultValue={edu.duration} className="admin-input" required />
                    <input type="text" name="grade" defaultValue={edu.grade} className="admin-input" required />
                    <input type="text" name="type" defaultValue={edu.type} className="admin-input" />
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">Update Education</button>
                      <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="keyword">{edu.degree}</h3>
                      <p className="comment">{edu.institution} • {edu.duration}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => setEditingId(edu._id)} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Edit</button>
                      <button onClick={() => deleteEducation(edu._id)} className="btn btn-outline" style={{ color: '#ff5555', borderColor: '#ff5555', fontSize: '0.7rem' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <h3 className="function">Add New Education</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addEducation(Object.fromEntries(formData));
                e.target.reset();
              }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" name="institution" placeholder="Institution" className="admin-input" required />
                <input type="text" name="degree" placeholder="Degree" className="admin-input" required />
                <input type="text" name="duration" placeholder="Duration" className="admin-input" required />
                <input type="text" name="grade" placeholder="Grade (GPA/%)" className="admin-input" required />
                <input type="text" name="type" placeholder="Type (e.g. Master's)" className="admin-input" />
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Education</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="code-block" style={{ padding: '1rem' }}>
            {projects.map((proj) => (
              <div key={proj._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                {editingId === proj._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateProject(proj._id, Object.fromEntries(formData));
                  }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" name="title" defaultValue={proj.title} className="admin-input" required />
                    <input type="text" name="tech" defaultValue={proj.tech} className="admin-input" required />
                    <textarea name="description" defaultValue={proj.description} className="admin-input" style={{ gridColumn: 'span 2' }} required></textarea>
                    <input type="text" name="link" defaultValue={proj.link} className="admin-input" placeholder="Live Link" />
                    <input type="text" name="github" defaultValue={proj.github} className="admin-input" placeholder="GitHub Link" />
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">Update Project</button>
                      <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="keyword">{proj.title}</h3>
                      <p className="comment">{proj.tech}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => setEditingId(proj._id)} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Edit</button>
                      <button onClick={() => deleteProject(proj._id)} className="btn btn-outline" style={{ fontSize: '0.8rem', color: '#ff5555', borderColor: '#ff5555' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <h3 className="function">Add New Project</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addProject(Object.fromEntries(formData));
                e.target.reset();
              }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" name="title" placeholder="Title" className="admin-input" required />
                <input type="text" name="tech" placeholder="Tech Stack (comma separated)" className="admin-input" required />
                <textarea name="description" placeholder="Description" className="admin-input" style={{ gridColumn: 'span 2' }} required></textarea>
                <input type="text" name="link" placeholder="Live Link" className="admin-input" />
                <input type="text" name="github" placeholder="GitHub Link" className="admin-input" />
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Project</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
