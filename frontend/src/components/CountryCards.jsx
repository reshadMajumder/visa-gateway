import { useNavigate } from 'react-router-dom'
import './CountryCards.css'

const CountryCards = () => {
  const navigate = useNavigate()

  const countries = [
    {
      id: 1,
      name: 'Romania',
      flag: '🇷🇴',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Work visas with accommodation and competitive salaries',
      processingTime: '7-12 months',
      visaTypes: ['Work Visa', 'Delivery Rider', 'Construction Worker', 'Kitchen Helper']
    },
    {
      id: 2,
      name: 'United States',
      flag: '🇺🇸',
      image: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tourist, Business, Student, and Work visas available',
      processingTime: '5-15 days',
      visaTypes: ['Tourist Visa', 'Business Visa', 'Student Visa', 'Work Visa']
    },
    {
      id: 3,
      name: 'Canada',
      flag: '🇨🇦',
      image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Express Entry, Study Permits, and Visitor visas',
      processingTime: '7-21 days',
      visaTypes: ['Visitor Visa', 'Study Permit', 'Work Permit', 'Express Entry']
    },
    {
      id: 4,
      name: 'United Kingdom',
      flag: '🇬🇧',
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Standard Visitor, Tier 4 Student, and Work visas',
      processingTime: '3-8 weeks',
      visaTypes: ['Standard Visitor', 'Student Visa', 'Work Visa', 'Transit Visa']
    },
    {
      id: 5,
      name: 'Australia',
      flag: '🇦🇺',
      image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tourist, Student, and Skilled Migration visas',
      processingTime: '10-30 days',
      visaTypes: ['Tourist Visa', 'Student Visa', 'Skilled Migration', 'Working Holiday']
    },
    {
      id: 6,
      name: 'Germany',
      flag: '🇩🇪',
      image: 'https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Schengen, Student, and Work visas for Germany',
      processingTime: '5-15 days',
      visaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Business Visa']
    },
    {
      id: 7,
      name: 'France',
      flag: '🇫🇷',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tourist, Business, and Long-stay visas',
      processingTime: '7-15 days',
      visaTypes: ['Tourist Visa', 'Business Visa', 'Long-stay Visa', 'Transit Visa']
    },
    {
      id: 8,
      name: 'Japan',
      flag: '🇯🇵',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tourist, Business, and Working visas',
      processingTime: '5-10 days',
      visaTypes: ['Tourist Visa', 'Business Visa', 'Working Visa', 'Student Visa']
    },
    {
      id: 9,
      name: 'Singapore',
      flag: '🇸🇬',
      image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tourist, Business, and Employment Pass',
      processingTime: '3-7 days',
      visaTypes: ['Tourist Visa', 'Business Visa', 'Employment Pass', 'Student Pass']
    }
  ]

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
                <div className="card-overlay">
                  <span className="processing-time">{country.processingTime}</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{country.name}</h3>
                  <span className="card-flag">{country.flag}</span>
                </div>
                <p className="card-description">{country.description}</p>
                <div className="visa-types">
                  {country.visaTypes.slice(0, 2).map((type, index) => (
                    <span key={index} className="visa-type-tag">{type}</span>
                  ))}
                  {country.visaTypes.length > 2 && (
                    <span className="visa-type-tag more">+{country.visaTypes.length - 2} more</span>
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