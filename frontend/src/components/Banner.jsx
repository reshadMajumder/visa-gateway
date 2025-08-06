import './Banner.css'

const Banner = () => {
  const handleScrollToCountries = (e) => {
    e.preventDefault()
    const countriesSection = document.getElementById('countries')
    if (countriesSection) {
      countriesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section className="banner w-[98vw] md:container mx-auto bg-red-600  rounded-lg mt-6">
      <div className="banner-overlay ">
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
              <button onClick={handleScrollToCountries} className="banner-button">Explore Visa Services</button>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner