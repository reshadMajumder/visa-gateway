import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

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

  const getCountryFlag = (code) => {
    if (!code) return '🌍'
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore visa services for the world's most sought-after destinations. 
            Professional processing with expert guidance every step of the way.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <div
              key={country.id}
              className={cn(
                "group relative bg-white rounded-xl overflow-hidden shadow-medium hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100",
                "transform hover:-translate-y-2",
                isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-10"
              )}
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleCountrySelect(country)}
            >
              {/* Country Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={country.image} 
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Country Flag & Code */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-2">
                  <span className="text-lg">{getCountryFlag(country.code)}</span>
                  <span className="text-sm font-medium text-gray-700">{country.code}</span>
                </div>

                {/* Popular Badge */}
                {index < 3 && (
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Popular</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors">
                    {country.name}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {country.description}
                </p>

                {/* Visa Types Preview */}
                {country.types && country.types.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {country.types.slice(0, 2).map((type, typeIndex) => (
                        <span
                          key={typeIndex}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200"
                        >
                          {type.name || type}
                        </span>
                      ))}
                      {country.types.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{country.types.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>5-10 days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>500+ applied</span>
                  </div>
                  {/* <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Multiple entry</span>
                  </div> */}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-700/5 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {countries.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2">
              <span>View All Countries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CountryCards