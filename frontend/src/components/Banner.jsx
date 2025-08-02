import './Banner.css'

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-overlay">
        <div className="container">
          <div className="banner-content">
            <div className="banner-left">
              <h1 className="banner-title">Your Global Visa Journey Starts Here</h1>
              <p className="banner-subtitle">
                Professional visa processing services for 50+ countries worldwide.
                Fast, reliable, and hassle-free visa applications with expert guidance
                every step of the way. Let us make your travel dreams a reality.
              </p>
            </div>
            <div className="banner-right">
              <a href="#countries" className="banner-button">Explore Visa Services</a>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner