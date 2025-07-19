import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CountryCards.css'

const CountryCards = () => {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/countries/')
        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleCountrySelect = (country) => {
    navigate(`/country/${country.id}`, { state: { country } })
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
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
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{country.name}</h3>
                </div>
                <p className="card-description">{country.description}</p>
                <div className="visa-types">
                  {country.types.slice(0, 2).map((type) => (
                    <span key={type.id} className="visa-type-tag">{type.name}</span>
                  ))}
                  {country.types.length > 2 && (
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