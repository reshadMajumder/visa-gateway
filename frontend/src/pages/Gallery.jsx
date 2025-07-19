import './Gallery.css'

const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Singapore Skyline',
      category: 'Destinations'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'London Bridge',
      category: 'Destinations'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Our Team',
      category: 'Office'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'New York City',
      category: 'Destinations'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Canadian Rockies',
      category: 'Destinations'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Consultation',
      category: 'Services'
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Sydney Opera House',
      category: 'Destinations'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Document Review',
      category: 'Services'
    }
  ]

  return (
    <div className="gallery-page">
      <section className="gallery-hero section">
        <div className="container">
          <h1 className="section-title">Gallery</h1>
          <p className="section-subtitle">
            Explore destinations and see our professional services in action
          </p>
        </div>
      </section>

      <section className="gallery-content section">
        <div className="container">
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.title} />
                <div className="gallery-overlay">
                  <h3>{image.title}</h3>
                  <span className="category">{image.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery