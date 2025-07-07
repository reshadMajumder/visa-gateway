import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CountryDetails from './pages/CountryDetails'
import VisaDetails from './pages/VisaDetails'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedVisa, setSelectedVisa] = useState(null)

  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setCurrentPage('country-details')
  }

  const handleVisaSelect = (visa, country) => {
    setSelectedVisa({ ...visa, country })
    setCurrentPage('visa-details')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onCountrySelect={handleCountrySelect} />
      case 'country-details':
        return <CountryDetails 
          country={selectedCountry} 
          onBack={() => setCurrentPage('home')}
          onVisaSelect={handleVisaSelect}
        />
      case 'visa-details':
        return <VisaDetails 
          visa={selectedVisa} 
          onBack={() => setCurrentPage('country-details')}
        />
      case 'about':
        return <About />
      case 'gallery':
        return <Gallery />
      case 'contact':
        return <Contact />
      default:
        return <Home onCountrySelect={handleCountrySelect} />
    }
  }

  return (
    <div className="App">
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App