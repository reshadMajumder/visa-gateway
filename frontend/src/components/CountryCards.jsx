import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CountryCards.css'

const CountryCards = () => {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/countries/')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Failed to fetch countries:', err))
  }, [])

  const handleCountrySelect = (country) => {
    navigate(`/country/${country.id}`, { state: { country } })
  }

  return (
    <section className="countries-section section" id="countries">
      <div className="container">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">
          Choose from our most popular visa destinations with fast processing and high success rates
        </p>
        <div className="countries-grid">
          {countries.map((country) => (
            <div 
              key={country.id} 
              className="country-card"
              onClick={() => handleCountrySelect(country)}
            >
              <div className="card-image">
                <img src={country.image} alt={country.name} />
                {/* You can add a card-overlay or processing time if your API provides it */}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{country.name}</h3>
                  {/* You can add a flag if your API provides it */}
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
      </div>
    </section>
  )
}

export default CountryCards