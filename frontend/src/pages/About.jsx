import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero section">
        <div className="container">
          <h1 className="section-title">About VisaGlobal</h1>
          <p className="section-subtitle">
            Your trusted partner for visa services worldwide with over 15 years of experience
          </p>
        </div>
      </section>

      <section className="about-content section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2008, VisaGlobal has been helping thousands of travelers, students, 
                and professionals achieve their international dreams. We specialize in providing 
                comprehensive visa services for over 50 countries worldwide.
              </p>
              <p>
                Our team of experienced visa consultants and immigration experts work tirelessly 
                to ensure your visa application process is smooth, efficient, and successful. 
                With a 98% success rate, we pride ourselves on delivering exceptional service.
              </p>
            </div>
            <div className="content-image">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Our team" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Visas Processed</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Success Rate</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Countries Covered</p>
            </div>
            <div className="stat-item">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Integrity</h3>
              <p>We maintain the highest standards of honesty and transparency in all our dealings.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for perfection in every visa application we handle.</p>
            </div>
            <div className="value-card">
              <h3>Customer Focus</h3>
              <p>Your success is our priority. We provide personalized service to meet your needs.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously improve our processes to provide faster and better service.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About