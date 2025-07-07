import './Banner.css'

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-overlay">
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Your Gateway to Global Opportunities</h1>
            <p className="banner-subtitle">
              Professional visa services for over 50+ countries worldwide. 
              Fast, reliable, and hassle-free visa processing with expert guidance.
            </p>
            <div className="banner-buttons">
              <a href="#countries" className="btn btn-primary">Explore Countries</a>
              <a href="#contact" className="btn btn-secondary">Get Consultation</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner