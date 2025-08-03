import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Clock,
  Shield,
  Award
} from 'lucide-react'

const Footer = () => {
  const [countries, setCountries] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/countries/')
      .then(response => response.json())
      .then(data => {
        setCountries(data.slice(0, 5)) // Get only first 5 countries
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  const handleCountryClick = (country) => {
    navigate(`/country/${country.id}`, { state: { country } })
  }

  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src='/logo.png' 
                alt="VisaGateway" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">VisaGateway</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for visa services worldwide. We make international 
              travel dreams come true with professional, reliable, and fast visa processing.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">24/7</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Countries */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Countries</h4>
            <ul className="space-y-3">
              {countries.map((country) => (
                <li key={country.id}>
                  <button
                    onClick={() => handleCountryClick(country)}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group text-left"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                    {country.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Business Center<br />
                    Downtown, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-xs">Mon - Fri, 9AM - 6PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-gray-300 text-sm">support@visagateway.com</p>
                  <p className="text-gray-400 text-xs">24/7 Support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-gray-300 text-sm">50+ Countries</p>
                  <p className="text-gray-400 text-xs">Worldwide Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 VisaGateway. All rights reserved. | Licensed Visa Consultant
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer