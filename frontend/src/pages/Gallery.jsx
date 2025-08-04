import React, { useState, useEffect } from 'react'
import './css/Gallery.css'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredImages, setFilteredImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState({})

  const galleryImages = [
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
  ]

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
  }, [selectedCategory])

  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="gallery-page ">
      {/* Enhanced Hero Section */}
      <section className="gallery-hero section">
        <div className="container mx-auto">
          <div className="hero-content mx-auto">
            <h1 className="font-bold text-5xl mx-auto">Visual Journey</h1>
            <p className="section-subtitle mx-auto">
              Explore destinations and see our professional services in action
            </p>
            <div className="hero-stats mx-auto">
              <div className="stat-item">
                <span className="stat-number">{galleryImages.length}</span>
                <span className="stat-label">Gallery Items</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section section">
        <div className="container mx-auto">
          <div className="filter-tabs mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span className="tab-count">
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
      <section className="gallery-content section">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="gallery-loading mx-auto">
              <div className="loading-spinner mx-auto"></div>
              <p>Loading beautiful images...</p>
            </div>
          ) : (
            <div className="gallery-grid mx-auto">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`gallery-item ${imageLoaded[image.id] ? 'loaded' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="image-container">
                    <img 
                      src={image.src} 
                      alt={image.title}
                      onLoad={() => handleImageLoad(image.id)}
                    />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="gallery-overlay">
                    <div className="overlay-content mx-auto">
                      <h3>{image.title}</h3>
                      <p className="image-description">{image.description}</p>
                      <span className="category">{image.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredImages.length === 0 && !isLoading && (
            <div className="no-results mx-auto">
              <div className="no-results-icon">📷</div>
              <h3>No images found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="gallery-cta section">
        <div className="container mx-auto">
          <div className="cta-content mx-auto">
            <h2>Ready to Start Your Journey?</h2>
            <p>Let our experienced team help you navigate the visa process and make your travel dreams a reality.</p>
            <button className="cta-button mx-auto">
              Book Free Consultation
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery