import './css/Contact.css'

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero section">
        <div className="container">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            Get in touch with our visa experts for personalized assistance
          </p>
        </div>
      </section>

      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>
                Ready to start your visa application? Our experienced team is here to help 
                you every step of the way. Contact us today for a free consultation.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>📍 Address</h3>
                  <p>123 Business Center<br />Downtown District<br />New York, NY 10001</p>
                </div>
                
                <div className="contact-item">
                  <h3>📞 Phone</h3>
                  <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                </div>
                
                <div className="contact-item">
                  <h3>✉️ Email</h3>
                  <p>info@visaglobal.com<br />support@visaglobal.com</p>
                </div>
                
                <div className="contact-item">
                  <h3>🕒 Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>Send us a Message</h2>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country of Interest</label>
                  <select id="country" name="country" required>
                    <option value="">Select a country</option>
                    <option value="usa">United States</option>
                    <option value="canada">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="japan">Japan</option>
                    <option value="singapore">Singapore</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="visaType">Visa Type</label>
                  <select id="visaType" name="visaType" required>
                    <option value="">Select visa type</option>
                    <option value="tourist">Tourist Visa</option>
                    <option value="business">Business Visa</option>
                    <option value="student">Student Visa</option>
                    <option value="work">Work Visa</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" placeholder="Tell us about your travel plans and any specific questions you have..."></textarea>
                </div>
                
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact