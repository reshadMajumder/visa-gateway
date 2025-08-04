import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VisaTypesCard from '../components/VisaTypesCard'
import './css/CountryDetails.css'
import './css/CountryDetailsEnhanced.css'
import ChildHero from '../components/ChildHero'

const CountryDetails = () => {
  const { countryId } = useParams()

  const location = useLocation()
  const [country, setCountry] = useState(location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍',
    image: 'http://127.0.0.1:8000/media/country_images/w1.jpg'
  })
  const [visaTypes, setVisaTypes] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    // Fetch visa types for the country - keeping original API call structure
    fetch(`http://127.0.0.1:8000/api/country-visa-types/${countryId}/`)
      .then(response => response.json())
      .then(data => {
        setVisaTypes(data)
        // Trigger animation after data is loaded
        setTimeout(() => setIsLoaded(true), 100)
      })
      .catch(error => {
        console.error('Error fetching visa types:', error)
        setError('Failed to load visa types')
      })
      .finally(() => setLoading(false))

    // Fetch country details - keeping original API call structure
    fetch(`http://127.0.0.1:8000/api/countries/${countryId}/`)
      .then(response => response.json())
      .then(data => {
        setCountry(data)
      })
      .catch(error => {
        console.error('Error fetching country details:', error)
        setError('Failed to load country details')
      })
  }, [countryId])

  return (
    <div className="country-details">
      {/* Enhanced Hero Section */}
      <div className="country-hero">
        <img src={country.image} alt={country.name} />
        <div className="hero-overlay">
          <div className="container">
            {/* Enhanced Title with Flag */}
            <div className="hero-content">
              <div className="country-flag-large">{country.flag}</div>
              <h1 className="country-title">{country.name} Visa Services</h1>
              <p className="country-subtitle">
                Professional visa processing with high success rates
              </p>
              {/* Stats Quick View */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5-7</span>
                  <span className="stat-label">Days Processing</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{visaTypes.length}</span>
                  <span className="stat-label">Visa Types</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90vw]  mx-auto">
        <section className="visa-categories-section section ">
          {/* Enhanced Section Header */}
          <div className="section-header-enhanced ">
            <div className="section-badge">Available Visa Categories</div>
            <h2 className="section-title">Choose Your Perfect Visa Type</h2>
            <p className="section-description">
              Select from our comprehensive range of visa categories designed to meet your specific travel and business needs
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading visa categories...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p className="error-text">{error}</p>
              <button 
                className="retry-button" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Visa Grid */}
          {!loading && !error && (
            <div className="visa-categories-grid px-10">
              {visaTypes.map((visa, index) => (
                <VisaTypesCard
                  key={visa.id}
                  visa={visa}
                  country={country}
                  index={index}
                  isLoaded={isLoaded}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && visaTypes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No Visa Types Available</h3>
              <p className="empty-description">
                We're currently updating our visa services for this country. Please check back soon or contact us for assistance.
              </p>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        {!loading && visaTypes.length > 0 && (
          <section className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Need Expert Assistance?</h3>
              <p className="cta-subtitle">
                Our visa specialists are here to guide you through the entire process and ensure your application success
              </p>
              <div className="cta-buttons">
                <button className="cta-button primary">Contact Expert</button>
                <button className="cta-button secondary">Schedule Consultation</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default CountryDetails