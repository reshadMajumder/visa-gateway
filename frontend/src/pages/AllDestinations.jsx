import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, Users, Star, ArrowRight, Globe, Filter, MapPin } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api.js'

const AllDestinations = () => {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedVisaType, setSelectedVisaType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_ENDPOINTS.COUNTRIES)
      const data = await response.json()
      setCountries(data)
    } catch (error) {
      console.error('Failed to fetch countries:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filterCountries = useCallback(() => {
    let filtered = countries

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by region (you can expand this based on your data structure)
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country =>
        country.region?.toLowerCase() === selectedRegion.toLowerCase()
      )
    }

    // Filter by visa type
    if (selectedVisaType !== 'all') {
      filtered = filtered.filter(country =>
        country.types?.some(type =>
          type && type.name && type.name.toLowerCase().includes(selectedVisaType.toLowerCase())
        )
      )
    }

    // Sort countries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'popular':
          return (b.types?.length || 0) - (a.types?.length || 0)
        default:
          return 0
      }
    })

    setFilteredCountries(filtered)
  }, [countries, searchQuery, selectedRegion, selectedVisaType, sortBy])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  useEffect(() => {
    filterCountries()
  }, [filterCountries])

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

  const getUniqueVisaTypes = () => {
    const types = new Set()
    countries.forEach(country => {
      country.types?.forEach(type => {
        if (type && type.name) {
          types.add(type.name)
        }
      })
    })
    return Array.from(types)
  }

  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 md:w-[85vw] w-[98vw] mx-auto">
      {/* Header Section */}
      <div className=" rounded-xl mt-5  bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
              <Globe className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mb-2 sm:mb-0 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
                All Destinations
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-primary-100 max-w-3xl mx-auto px-4">
              Explore visa services for {countries.length} countries worldwide. 
              Professional processing with expert guidance for your travel dreams.
            </p>
          </div>
        </div>
      </div>

  












      {/* Countries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {filteredCountries.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <Globe className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredCountries.map((country, index) => (
              <div
                key={country.id}
                className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 transform hover:-translate-y-2"
                onClick={() => handleCountrySelect(country)}
              >
                {/* Country Image */}
                <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Country Flag & Code */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg px-2 sm:px-3 py-1 flex items-center space-x-1 sm:space-x-2">
                    <span className="text-base sm:text-lg">{getCountryFlag(country.code)}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{country.code}</span>
                  </div>

                  {/* Popular Badge */}
                  {index < 6 && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Popular</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {country.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {country.description || `Explore visa services and requirements for ${country.name}. Professional processing with expert guidance.`}
                  </p>

                  {/* Visa Types Preview */}
                  {country.types && country.types.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {country.types.slice(0, 2).map((type, typeIndex) => (
                          <span
                            key={typeIndex}
                            className="px-2 sm:px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200 line-clamp-1"
                          >
                            {type.name}
                          </span>
                        ))}
                        {country.types.length > 2 && (
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{country.types.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">5-10 days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">500+ applied</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-700/5 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      {/* <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6">Need Help Choosing?</h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-primary-100 mb-6 sm:mb-8 lg:mb-10 px-4">
            Our visa experts are here to guide you through the application process and help you select the right visa for your needs.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-primary-900 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 text-sm sm:text-base lg:text-lg"
          >
            <span>Contact Our Experts</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default AllDestinations
