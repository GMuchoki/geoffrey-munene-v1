import { Link } from 'react-router-dom'
import { 
  HiEnvelope,
} from 'react-icons/hi2'
import { 
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'
import '../styles/components/footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-brand-name">
              <span className="logo-first">Remo</span>
              <span className="logo-second">work</span>
            </h3>
            <p className="footer-brand-description">
              Helping people land remote jobs, work online, and grow digital careers.
            </p>
            <div className="footer-social">
              <a href="https://x.com/munene_muchoki" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.linkedin.com/in/munenemuchoki" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="mailto:munenemuchokiofficial@gmail.com" className="social-icon" aria-label="Email">
                <HiEnvelope />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4 className="footer-links-title">SITE LINKS</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/blog" className="footer-link">Blog</Link></li>
                <li><Link to="/services" className="footer-link">Services</Link></li>
                <li><Link to="/tools" className="footer-link">Tools</Link></li>
                <li><Link to="/learn" className="footer-link">Learn</Link></li>
                <li><Link to="/remote-jobs" className="footer-link">Remote Jobs</Link></li>
                <li><Link to="/community" className="footer-link">Community</Link></li>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-links-title">RESOURCES</h4>
              <ul className="footer-links-list">
                <li><Link to="/tools?tool=resume-builder" className="footer-link">Resume Builder</Link></li>
                <li><Link to="/tools?tool=email-templates" className="footer-link">Email Templates</Link></li>
                <li><Link to="/learn" className="footer-link">YouTube Playlists</Link></li>
                <li><Link to="/blog?category=Interviewing" className="footer-link">Interview Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal-links">
            <Link to="/terms" className="footer-legal-link">Terms & Conditions</Link>
            <span className="footer-legal-separator">|</span>
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Remowork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


