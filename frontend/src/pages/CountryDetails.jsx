import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './CountryDetails.css'

const CountryDetails = () => {
  const { countryId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get country data from location state or fallback data
  const country = location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍',
    image: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  const visaCategories = [
    {
      id: 1,
      name: country?.name === 'Romania' ? 'Work Visa' : 'Tourist Visa',
      image: country?.name === 'Romania' ? 
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: country?.name === 'Romania' ? 
        'Work opportunities with accommodation and competitive salaries' :
        'Perfect for leisure travel, sightseeing, and vacation trips',
      duration: country?.name === 'Romania' ? '1-2 years' : '30-90 days',
      price: country?.name === 'Romania' ? 'Payment After Visa' : '$150',
      features: country?.name === 'Romania' ? 
        ['Accommodation Provided', 'Competitive Salary', 'Multiple Entry'] :
        ['Multiple Entry', 'Fast Processing', 'Online Application'],
      processingTime: country?.name === 'Romania' ? '7-12 months' : '5-7 days'
    },
    {
      id: 2,
      name: country?.name === 'Romania' ? 'Delivery Rider' : 'Business Visa',
      image: country?.name === 'Romania' ? 
        'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: country?.name === 'Romania' ? 
        'Food delivery positions with bike provided and flexible hours' :
        'Ideal for business meetings, conferences, and trade activities',
      duration: country?.name === 'Romania' ? '1-2 years' : '30-180 days',
      price: country?.name === 'Romania' ? 'Payment After Visa' : '$200',
      features: country?.name === 'Romania' ? 
        ['Bike Provided', 'Flexible Hours', 'Food Allowance'] :
        ['Multiple Entry', 'Extended Stay', 'Priority Processing'],
      processingTime: country?.name === 'Romania' ? '7-12 months' : '7-10 days'
    },
    {
      id: 3,
      name: country?.name === 'Romania' ? 'Construction Worker' : 'Student Visa',
      image: country?.name === 'Romania' ? 
        'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: country?.name === 'Romania' ? 
        'Construction and building work with accommodation and tools provided' :
        'For educational purposes, studies, and academic programs',
      duration: country?.name === 'Romania' ? '1-2 years' : '1-4 years',
      price: country?.name === 'Romania' ? 'Payment After Visa' : '$300',
      features: country?.name === 'Romania' ? 
        ['Tools Provided', 'Accommodation', 'Training Available'] :
        ['Long Term', 'Work Permit', 'Family Visa'],
      processingTime: country?.name === 'Romania' ? '7-12 months' : '15-30 days'
    },
    {
      id: 4,
      name: country?.name === 'Romania' ? 'Kitchen Helper' : 'Work Visa',
      image: country?.name === 'Romania' ? 
        'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: country?.name === 'Romania' ? 
        'Restaurant and kitchen work with meals provided and training' :
        'For employment opportunities and professional work',
      duration: country?.name === 'Romania' ? '1-2 years' : '1-3 years',
      price: country?.name === 'Romania' ? 'Payment After Visa' : '$400',
      features: country?.name === 'Romania' ? 
        ['Meals Provided', 'Training Included', 'Career Growth'] :
        ['Work Authorization', 'Family Visa', 'Path to Residency'],
      processingTime: country?.name === 'Romania' ? '7-12 months' : '20-45 days'
    }
  ]

  const handleBack = () => {
    navigate('/')
  }

  const handleVisaSelect = (visa) => {
    navigate(`/visa/${countryId}/${visa.id}`, { 
      state: { visa, country } 
    })
  }

  return (
    <div className="country-details">
      <div className="country-hero">
        <img src={country.image} alt={country.name} />
        <div className="hero-overlay">
          <div className="container">
            <button className="back-button" onClick={handleBack}>
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
                onClick={() => handleVisaSelect(visa)}
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