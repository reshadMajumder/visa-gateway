import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VisaTypesCard from '../components/VisaTypesCard'
import './css/CountryDetails.css'

const CountryDetails = () => {
  const { countryId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [country, setCountry] = useState(location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍',
    image: 'http://127.0.0.1:8000/media/country_images/w1.jpg'
  })
  const [visaTypes, setVisaTypes] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Fetch visa types for the country
    fetch(`http://127.0.0.1:8000/api/country-visa-types/${countryId}/`)
      .then(response => response.json())
      .then(data => {
        setVisaTypes(data)
        // Trigger animation after data is loaded
        setTimeout(() => setIsLoaded(true), 100)
      })
      .catch(error => console.error('Error fetching visa types:', error))

    // Fetch country details
    fetch(`http://127.0.0.1:8000/api/countries/${countryId}/`)
      .then(response => response.json())
      .then(data => {
        setCountry(data)
      })
      .catch(error => console.error('Error fetching country details:', error))
  }, [countryId])

  const handleBack = () => {
    navigate('/')
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
        </section>
      </div>
    </div>
  )
}

export default CountryDetails