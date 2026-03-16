import { useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import API_BASE_URL from '../config';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/portfolios/slug/${username}`);
        if (res.ok) {
          setPortfolio(await res.json());
          setError(null);
        } else {
          setError('Portfolio not found or not published');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}><div className="comment">// Loading portfolio...</div></div>;
  if (error) return <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}><h2 style={{ color: '#ef4444' }}>{error}</h2></div>;

  const userId = portfolio.userId._id || portfolio.userId;

  return (
    <Routes>
      <Route path="/" element={<Home userId={userId} />} />
      <Route path="/about" element={<About userId={userId} />} />
      <Route path="/projects" element={<Projects userId={userId} />} />
      <Route path="/contact" element={<Contact userId={userId} />} />
    </Routes>
  );
};

export default PublicPortfolio;
