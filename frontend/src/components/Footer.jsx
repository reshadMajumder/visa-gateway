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
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-xl blur opacity-60"></div>
                <img 
                  src='/logo.png' 
                  alt="VisaGateway" 
                  className="w-12 h-12 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                VisaGateway
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Your trusted partner for visa services worldwide. We make international 
              travel dreams come true with professional, reliable, and fast visa processing.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <Shield className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-xs font-medium">Secure</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <Award className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-xs font-medium">Certified</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <Clock className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-xs font-medium">24/7</span>
              </div>
            </div>






{/* //lalalal */}











            {/* Social Links */}
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-11 h-11 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl flex items-center justify-center hover:from-sky-500 hover:to-sky-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/25 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 bg-gradient-to-r from-pink-600 to-rose-700 rounded-xl flex items-center justify-center hover:from-pink-500 hover:to-rose-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          







          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-blue-400" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                  <span className="group-hover:font-medium">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                  <span className="group-hover:font-medium">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                  <span className="group-hover:font-medium">Gallery</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                  <span className="group-hover:font-medium">Contact</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                  <span className="group-hover:font-medium">My Account</span>
                </Link>
              </li>
            </ul>
          </div>
          





          {/* Popular Countries */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-400" />
              Popular Countries
            </h4>
            <ul className="space-y-4">
              {countries.map((country, index) => (
                <li key={country.id}>
                  <button
                    onClick={() => handleCountryClick(country)}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-left w-full hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ArrowRight className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform text-blue-400" />
                    <span className="group-hover:font-medium">{country.name}</span>
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </li>
              ))}
              {countries.length === 0 && (
                <li className="text-gray-400 text-sm italic flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Loading countries...
                </li>
              )}
            </ul>
          </div>
          







          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Contact Info
            </h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Office Address</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    123 Business Center<br />
                    Downtown, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Phone Support</p>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-xs">Mon - Fri, 9AM - 6PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Email Support</p>
                  <p className="text-gray-300 text-sm">support@visagateway.com</p>
                  <p className="text-gray-400 text-xs">24/7 Support Available</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                  <Globe className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Global Reach</p>
                  <p className="text-gray-300 text-sm">50+ Countries</p>
                  <p className="text-gray-400 text-xs">Worldwide Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-300 text-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>© 2024 VisaGateway. All rights reserved.</span>
              <div className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></div>
              <span className="hidden md:inline text-blue-300 font-medium">Licensed Visa Consultant</span>
            </div>
            <div className="flex space-x-8 text-sm">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:underline underline-offset-4 decoration-blue-300"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:underline underline-offset-4 decoration-blue-300"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:underline underline-offset-4 decoration-blue-300"
              >
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