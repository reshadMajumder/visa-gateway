import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VisaTypesCard from '../components/VisaTypesCard'
import { API_ENDPOINTS, buildMediaUrl, API_CONFIG } from '../config/api.js'
import './css/CountryDetails.css'
import './css/CountryDetailsEnhanced.css'
import ChildHero from '../components/ChildHero'

const CountryDetails = () => {
  const { countryId } = useParams()
  const navigate = useNavigate()

  const handleContactExpert = () => {
    navigate('/contact')
  }

  const location = useLocation()
  const [country, setCountry] = useState(location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍',
    image: `${API_CONFIG.BASE_URL}/media/country_images/w1.jpg`
  })
  const [visaTypes, setVisaTypes] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    // Fetch visa types for the country - keeping original API call structure
    fetch(`${API_ENDPOINTS.COUNTRY_VISA_TYPES}/${countryId}/`)
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
    fetch(`${API_ENDPOINTS.COUNTRIES}/${countryId}/`)
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
          <div className="md:w-[85vw] w-[98vw]  mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Title with Flag */}
            <div className="hero-content text-center">
              <div className="country-flag-large text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6">{country.flag}</div>
              <h1 className="country-title text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">{country.name} Visa Services</h1>
              <p className="country-subtitle text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-6 sm:mb-8 lg:mb-10 px-4">
                Professional visa processing with high success rates
              </p>
              {/* Stats Quick View */}
              <div className="hero-stats flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 px-4">
                <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6">
                  <span className="stat-number block text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">98%</span>
                  <span className="stat-label text-xs sm:text-sm lg:text-base text-gray-200">Success Rate</span>
                </div>
                <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6">
                  <span className="stat-number block text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">5-7</span>
                  <span className="stat-label text-xs sm:text-sm lg:text-base text-gray-200">Days Processing</span>
                </div>
                <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6">
                  <span className="stat-number block text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{visaTypes.length}</span>
                  <span className="stat-label text-xs sm:text-sm lg:text-base text-gray-200">Visa Types</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="visa-categories-section py-8 sm:py-12 lg:py-16 xl:py-20">
          {/* Enhanced Section Header */}
          <div className="section-header-enhanced text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="section-badge inline-block bg-primary-100 text-primary-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">Available Visa Categories</div>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#254d8b] mb-3 sm:mb-4 px-4">Choose Your Perfect Visa Type</h2>
            <p className="section-description text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Select from our comprehensive range of visa categories designed to meet your specific travel and business needs
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="loading-container text-center py-12 sm:py-16 lg:py-20">
              <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 sm:border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="loading-text text-gray-600 text-sm sm:text-base">Loading visa categories...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container text-center py-12 sm:py-16 lg:py-20">
              <div className="error-icon text-3xl sm:text-4xl lg:text-5xl mb-4">⚠️</div>
              <p className="error-text text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 px-4">{error}</p>
              <button 
                className="retry-button bg-primary-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Visa Grid */}
          {!loading && !error && (
            <div className="visa-categories-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 lg:px-6 xl:px-10">
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
            <div className="empty-state text-center py-12 sm:py-16 lg:py-20">
              <div className="empty-icon text-3xl sm:text-4xl lg:text-5xl mb-4">📋</div>
              <h3 className="empty-title text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 px-4">No Visa Types Available</h3>
              <p className="empty-description text-gray-600 text-sm sm:text-base max-w-md mx-auto px-4">
                We're currently updating our visa services for this country. Please check back soon or contact us for assistance.
              </p>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        {!loading && visaTypes.length > 0 && (
          <section className="cta-section py-8 sm:py-12 lg:py-16 xl:py-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg sm:rounded-xl mx-2 sm:mx-0">
            <div className="cta-content text-center px-4 sm:px-6 lg:px-8">
              <h3 className="cta-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Need Expert Assistance?</h3>
              <p className="cta-subtitle text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto">
                Our visa specialists are here to guide you through the entire process and ensure your application success
              </p>
              <div className="cta-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button 
                  className="cta-button primary bg-white text-primary-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200" 
                  onClick={handleContactExpert}
                >
                  Contact Expert
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default CountryDetails