import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CountryCards.css'

const CountryCards = () => {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/countries/')
      .then(res => res.json())
      .then(data => {
        setCountries(data)
        // Trigger animation after data is loaded
        setTimeout(() => setIsLoaded(true), 100)
      })
      .catch(err => console.error('Failed to fetch countries:', err))
  }, [])

  const handleCountrySelect = (country) => {
    navigate(`/country/${country.id}`, { state: { country } })
  }

  return (
    <div className="countries-grid">
      {countries.map((country, index) => (
        <div
          key={country.id}
          className={`country-card ${isLoaded ? 'card-visible' : ''}`}
          style={{ 
            animationDelay: `${index * 0.2}s`,
            transform: isLoaded ? 'translateY(0)' : 'translateY(100px)',
            opacity: isLoaded ? 1 : 0
          }}
          onClick={() => handleCountrySelect(country)}
        >
          <div className="card-image">
            <img src={country.image} alt={country.name} />
            <div className="country-code">
              {country.code}
            </div>
          </div>
          <div className="card-content">
            <div className="card-header">
              <h3 className="card-title">{country.name}</h3>
            </div>
            <p className="card-description">{country.description}</p>
            <div className="visa-types">
              {country.types && country.types.slice(0, 2).map((type, index) => (
                <span key={index} className="visa-type-tag">{type.name}</span>
              ))}
              {country.types && country.types.length > 2 && (
                <span className="visa-type-tag more">+{country.types.length - 2} more</span>
              )}
            </div>
            <div className="card-footer">
              <button className="card-button">View Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CountryCards