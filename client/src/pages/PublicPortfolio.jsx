import { useParams } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';

const PublicPortfolio = () => {
  const { username } = useParams();
  
  // This will eventually fetch based on username and use the selected template.
  // For now, it just wraps the existing pages.
  return (
    <div>
      <Home />
      <div id="about"><About /></div>
      <div id="projects"><Projects /></div>
      <div id="contact"><Contact /></div>
    </div>
  );
};

export default PublicPortfolio;
