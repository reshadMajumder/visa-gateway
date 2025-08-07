import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Gallery.css'

const Gallery = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredImages, setFilteredImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const handleBookConsultation = () => {
    navigate('/contact')
  }

  const galleryImages = useMemo(() => [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Singapore Skyline',
      category: 'Destinations',
      description: 'Modern cityscape with stunning architecture'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'London Bridge',
      category: 'Destinations',
      description: 'Iconic landmark in the heart of London'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Our Professional Team',
      category: 'Office',
      description: 'Dedicated visa consultants ready to help'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'New York City',
      category: 'Destinations',
      description: 'The city that never sleeps'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Canadian Rockies',
      category: 'Destinations',
      description: 'Breathtaking natural beauty of Canada'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Personal Consultation',
      category: 'Services',
      description: 'One-on-one visa guidance sessions'
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Sydney Opera House',
      category: 'Destinations',
      description: 'Australia\'s architectural masterpiece'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Document Review',
      category: 'Services',
      description: 'Comprehensive application assessment'
    }
  ], [])

  const categories = ['All', 'Destinations', 'Services', 'Office']

  useEffect(() => {
    // Simulate loading delay for better UX
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredImages(galleryImages)
    } else {
      setFilteredImages(galleryImages.filter(image => image.category === selectedCategory))
    }
  }, [selectedCategory, galleryImages])

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white md:w-[85vw] w-[98vw] mx-auto">
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white relative overflow-hidden rounded-xl mt-5">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Visual Journey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-4">
              Explore destinations and see our professional services in action
            </p>
            
            {/* Stats Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {galleryImages.length}
                </div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Gallery Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {categories.length - 1}
                </div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 sm:col-span-1 col-span-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">100+</div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border-2 border-blue-600'
                    : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category === 'All' 
                    ? galleryImages.length 
                    : galleryImages.filter(img => img.category === category).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading beautiful images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <img 
                      src={image.src} 
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-200 mb-3 leading-relaxed">
                      {image.description}
                    </p>
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {image.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">📷</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No images found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      {/* <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
       
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              Let our experienced team help you navigate the visa process and make your travel dreams a reality.
            </p>
            <button 
              className="bg-gradient-to-r from-white to-gray-100 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:from-gray-100 hover:to-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/25 inline-flex items-center gap-2 group"
              onClick={handleBookConsultation}
            >
              Book Free Consultation
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Gallery