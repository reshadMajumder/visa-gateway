import { useState } from 'react'
import './Navbar.css'

const Navbar = ({ onNavigate, currentPage }) => {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Switzerland'
  ]

  const handleCountryClick = (country) => {
    setIsCountryDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // This would navigate to country-specific page
    console.log(`Navigate to ${country}`)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-logo">
            <h2>Schengen Visa</h2>
          </div>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate('home')
                setIsMobileMenuOpen(false)
              }}
            >
              Home
            </a>
            
            <div className="nav-dropdown">
              <a 
                href="#" 
                className="nav-link dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault()
                  setIsCountryDropdownOpen(!isCountryDropdownOpen)
                }}
              >
                Countries
                <span className="dropdown-arrow">▼</span>
              </a>
              {isCountryDropdownOpen && (
                <div className="dropdown-menu">
                  {countries.map((country, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault()
                        handleCountryClick(country)
                      }}
                    >
                      {country}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate('about')
                setIsMobileMenuOpen(false)
              }}
            >
              About
            </a>
            
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'gallery' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate('gallery')
                setIsMobileMenuOpen(false)
              }}
            >
              Gallery
            </a>
            
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate('contact')
                setIsMobileMenuOpen(false)
              }}
            >
              Contact
            </a>
          </div>
          
          <div className="nav-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar