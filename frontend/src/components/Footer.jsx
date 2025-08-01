import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VisaGlobal</h3>
            <p>
              Your trusted partner for visa services worldwide. We make international 
              travel dreams come true with professional, reliable, and fast visa processing.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Popular Countries</h4>
            <ul>
              <li><a href="#usa">United States</a></li>
              <li><a href="#canada">Canada</a></li>
              <li><a href="#uk">United Kingdom</a></li>
              <li><a href="#australia">Australia</a></li>
              <li><a href="#germany">Germany</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><span>📍</span> 123 Business Center, NY 10001</p>
              <p><span>📞</span> +1 (555) 123-4567</p>
              <p><span>✉️</span> info@visaglobal.com</p>
              <p><span>🕒</span> Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 VisaGlobal. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer