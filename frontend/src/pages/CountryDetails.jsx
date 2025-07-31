import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './CountryDetails.css'

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

  useEffect(() => {
    // Fetch visa types for the country
    fetch(`http://127.0.0.1:8000/api/country-visa-types/${countryId}/`)
      .then(response => response.json())
      .then(data => {
        setVisaTypes(data)
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
            {visaTypes.map((visa) => (
              <div 
                key={visa.id} 
                className="visa-category-card"
                onClick={() => handleVisaSelect(visa)}
              >
                <div className="visa-card-image">
                  <img 
                    src={`http://127.0.0.1:8000${visa.image}`} 
                    alt={visa.name} 
                  />
                  <div className="visa-card-overlay">
                    <span className="visa-price-badge">
                      {visa.price ? `$${visa.price}` : 'Contact'}
                    </span>
                    {visa.active && <span className="visa-status">Active</span>}
                  </div>
                </div>
                <div className="visa-card-content">
                  <div className="visa-card-header">
                    <h3 className="visa-card-title">{visa.name}</h3>
                    <h4 className="visa-headings">{visa.headings}</h4>
                  </div>
                  <p className="visa-card-description">{visa.description}</p>
                  
                  {visa.expected_processing_time && (
                    <div className="processing-time">
                      <span>Processing Time: {visa.expected_processing_time}</span>
                    </div>
                  )}
                  
                  <div className="visa-details">
                    <div className="visa-section">
                      <h5>Required Documents ({visa.required_documents.length})</h5>
                      <ul className="document-list">
                        {visa.required_documents.slice(0, 2).map(doc => (
                          <li key={doc.id}>
                            {doc.document_name}
                            {doc.is_mandatory && <span className="mandatory">*</span>}
                          </li>
                        ))}
                        {visa.required_documents.length > 2 && (
                          <li>+{visa.required_documents.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                    
                    {visa.processes.length > 0 && (
                      <div className="visa-section">
                        <h5>Process Steps ({visa.processes.length})</h5>
                        <ul className="process-list">
                          {visa.processes.slice(0, 1).map(process => (
                            <li key={process.id}>{process.points}</li>
                          ))}
                          {visa.processes.length > 1 && (
                            <li>+{visa.processes.length - 1} more steps</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="visa-meta">
                    <span className="visa-created">
                      Added: {new Date(visa.created_at).toLocaleDateString()}
                    </span>
                    <span className="visa-updated">
                      Updated: {new Date(visa.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="visa-card-footer">
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