import './CountryDetails.css'

const CountryDetails = ({ country, onBack, onVisaSelect }) => {
  if (!country) return null

  const visaCategories = [
    {
      id: 1,
      name: 'Tourist Visa',
      image: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Perfect for leisure travel, sightseeing, and vacation trips',
      duration: '30-90 days',
      price: '$150',
      features: ['Multiple Entry', 'Fast Processing', 'Online Application'],
      processingTime: '5-7 days'
    },
    {
      id: 2,
      name: 'Business Visa',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ideal for business meetings, conferences, and trade activities',
      duration: '30-180 days',
      price: '$200',
      features: ['Multiple Entry', 'Extended Stay', 'Priority Processing'],
      processingTime: '7-10 days'
    },
    {
      id: 3,
      name: 'Student Visa',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'For educational purposes, studies, and academic programs',
      duration: '1-4 years',
      price: '$300',
      features: ['Long Term', 'Work Permit', 'Family Visa'],
      processingTime: '15-30 days'
    },
    {
      id: 4,
      name: 'Work Visa',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'For employment opportunities and professional work',
      duration: '1-3 years',
      price: '$400',
      features: ['Work Authorization', 'Family Visa', 'Path to Residency'],
      processingTime: '20-45 days'
    }
  ]

  return (
    <div className="country-details">
      <div className="country-hero">
        <img src={country.image} alt={country.name} />
        <div className="hero-overlay">
          <div className="container">
            <button className="back-button" onClick={onBack}>
              ← Back to Countries
            </button>
            <h1 className="country-title">{country.name} Visa Services</h1>
            <p className="country-subtitle">
              Professional visa processing with high success rates
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="visa-categories-section section">
          <h2 className="section-title">Available Visa Categories</h2>
          <p className="section-subtitle">
            Choose the visa type that best fits your travel purpose
          </p>
          
          <div className="visa-categories-grid">
            {visaCategories.map((visa) => (
              <div 
                key={visa.id} 
                className="visa-category-card"
                onClick={() => onVisaSelect(visa, country)}
              >
                <div className="visa-card-image">
                  <img src={visa.image} alt={visa.name} />
                  <div className="visa-card-overlay">
                    <span className="visa-price-badge">{visa.price}</span>
                  </div>
                </div>
                <div className="visa-card-content">
                  <div className="visa-card-header">
                    <h3 className="visa-card-title">{visa.name}</h3>
                    <span className="visa-duration">{visa.duration}</span>
                  </div>
                  <p className="visa-card-description">{visa.description}</p>
                  <div className="visa-features">
                    {visa.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="visa-feature-tag">{feature}</span>
                    ))}
                    {visa.features.length > 2 && (
                      <span className="visa-feature-tag">+{visa.features.length - 2} more</span>
                    )}
                  </div>
                  <div className="visa-card-footer">
                    <span className="processing-time-info">{visa.processingTime}</span>
                    <button className="visa-view-button">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CountryDetails