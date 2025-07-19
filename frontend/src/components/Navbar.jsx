import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const countries = [
    { name: 'Romania', flag: '🇷🇴', id: 1 },
    { name: 'United States', flag: '🇺🇸', id: 2 },
    { name: 'Canada', flag: '🇨🇦', id: 3 },
    { name: 'United Kingdom', flag: '🇬🇧', id: 4 },
    { name: 'Australia', flag: '🇦🇺', id: 5 },
    { name: 'Germany', flag: '🇩🇪', id: 6 },
    { name: 'France', flag: '🇫🇷', id: 7 },
    { name: 'Japan', flag: '🇯🇵', id: 8 },
    { name: 'Singapore', flag: '🇸🇬', id: 9 }
  ]

  const handleCountrySelect = (country) => {
    setIsCountriesDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Navigate to country page
    window.location.href = `/country/${country.id}`
  }
  return (
    <>
      {/* Top Navbar - Logo and Auth */}
      <div className="top-navbar">
        <div className="container">
          <div className="top-nav-content">
            <div className="nav-logo">
              <Link to="/">
                <div className="nav-logo-icon">✈️</div>
                <div>
                  <h2>VisaGlobal</h2>
                  <span className="tagline">One World, One Visa</span>
                </div>
              </Link>
            </div>
            
            <div className="auth-section">
              <Link to="/login" className="auth-link login">
                LOG IN
              </Link>
              <span className="separator">|</span>
              <Link to="/signup" className="auth-link signup">
                SIGN UP
              </Link>
            </div>
            
            {/* Mobile toggle button */}
            <div 
              className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="main-nav-content">
            <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ABOUT US
              </Link>
              
              <div className="countries-dropdown">
                <button 
                  className={`dropdown-toggle ${isCountriesDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                >
                  COUNTRIES
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className={`dropdown-menu ${isCountriesDropdownOpen ? 'open' : ''}`}>
                  {countries.map((country) => (
                    <button
                      key={country.id}
                      className="dropdown-item"
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.flag} {country.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/gallery" 
                className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GALLERY
              </Link>
              
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              
              <Link 
                to="/account" 
                className={`nav-link ${isActive('/account') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                MY ACCOUNT
              </Link>
              
              {/* Mobile auth section */}
              <div className="mobile-auth-section">
                <Link 
                  to="/login" 
                  className="mobile-auth-link login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  LOG IN
                </Link>
                <Link 
                  to="/signup" 
                  className="mobile-auth-link signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar