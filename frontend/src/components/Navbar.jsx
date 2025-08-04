import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, User, LogOut, Settings, Globe, Menu, X } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    
    console.log('Checking auth status:', { accessToken: !!accessToken, userData: !!userData })
    
    if (accessToken && userData) {
      console.log('Setting authenticated to true')
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    } else {
      console.log('Setting authenticated to false')
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Force re-render when auth state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken')
      const userData = localStorage.getItem('user')
      const shouldBeAuthenticated = !!(accessToken && userData)
      
      if (shouldBeAuthenticated !== isAuthenticated) {
        console.log('Auth state mismatch detected, updating...')
        checkAuthStatus()
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    // Fetch countries from API
    fetch('http://127.0.0.1:8000/api/countries/')
      .then(response => response.json())
      .then(data => {
        setCountries(data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  useEffect(() => {
    // Check if user is authenticated on component mount
    checkAuthStatus()

    // Listen for authentication state changes
    const handleAuthChange = () => {
      console.log('Auth state changed event received')
      checkAuthStatus()
    }

    // Add event listener for authentication changes
    window.addEventListener('authStateChanged', handleAuthChange)

    // Cleanup event listener
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    // Call logout API
    fetch('http://127.0.0.1:8000/api/accounts/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    }).finally(() => {
      // Clear localStorage and state regardless of API response
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setUser(null)
      setIsProfileDropdownOpen(false)
      
      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new Event('authStateChanged'))
      
      // Small delay to ensure event is processed before navigation
      setTimeout(() => {
        navigate('/')
      }, 100)
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const closeAllDropdowns = () => {
    setIsCountriesDropdownOpen(false)
    setIsProfileDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns()
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getCountryFlag = (code) => {
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  const handleCountrySelect = (country) => {
    setIsCountriesDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate(`/country/${country.id}`, { state: { country } })
  }

  return (
    <>
      {/* Top Navbar - Logo and Auth */}
      <div className={`top-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto">
          <div className="top-nav-content">
            <div className="">
              <Link  className="flex items-center gap-3" to="/">
                <img className='rounded-full object-cover w-12' src='/logo.png' alt="VisaGlobal" />
                <span className="logo-text">VisaGlobal</span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="search-bar desktop-only">
              <form onSubmit={handleSearch}>
                <div className="search-input-container">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="     Search countries, visa types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </form>
            </div>
            
            <div className="auth-section">
              {isAuthenticated ? (
                <div className="auth-controls">
                  {/* Notifications */}
                  <button className="notification-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="notification-badge">0</span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="profile-button"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                      <div className="profile-avatar">
                        <User size={18} />
                      </div>
                      <span className="profile-name">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}</span>
                      <ChevronDown className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`} size={16} />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="profile-dropdown-menu">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-avatar">
                              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}</div>
                              <div className="user-email">{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <Link 
                          to="/account" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link 
                          to="/account" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Globe size={16} />
                          My Applications
                        </Link>
                        {/* <Link 
                          to="/account" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          Settings
                        </Link> */}
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item logout-btn"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="auth-link login">
                    LOG IN
                  </Link>
                  <span className="separator">|</span>
                  <Link to="/signup" className="auth-link signup">
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile toggle button */}
            <button 
              className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar  ">
        <div className="container mx-auto ">
          <div className="main-nav-content ">
            <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              {/* Mobile Search */}
              <div className="mobile-search mobile-only">
                <form onSubmit={handleSearch}>
                  <div className="search-input-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Search countries, visa types..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input "
                    />
                  </div>
                </form>
              </div>

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
              
              <div className="countries-dropdown" onClick={(e) => e.stopPropagation()}>
                <button 
                  className={`dropdown-toggle ${isCountriesDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                >
                  <Globe size={16} />
                  COUNTRIES
                  <ChevronDown className={`dropdown-arrow ${isCountriesDropdownOpen ? 'open' : ''}`} size={16} />
                </button>
                <div className={`dropdown-menu ${isCountriesDropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-header">
                    <span className="dropdown-title">Select Destination</span>
                  </div>
                  <div className="countries-grid">
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        className="dropdown-item country-item"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <span className="country-flag">{getCountryFlag(country.code)}</span>
                        <span className="country-name">{country.name}</span>
                        <span className="country-visa-count">{country.visa_types?.length || 0} visas</span>
                      </button>
                    ))}
                  </div>
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
              
              {isAuthenticated && (
                <Link 
                  to="/account" 
                  className={`nav-link ${isActive('/account') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  MY ACCOUNT
                </Link>
              )}

              {/* Mobile Auth Links */}
              {!isAuthenticated && (
                <div className="mobile-auth mobile-only">
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
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </>
  )
}

export default Navbar