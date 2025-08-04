import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OTPVerification from './pages/OTPVerification'
import CountryDetails from './pages/CountryDetails'
import VisaDetails from './pages/VisaDetails'
import ApplyWithDocuments from './pages/ApplyWithDocuments'
import UserVisaDetails from './pages/UserVisaDetails'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import UserAccount from './pages/UserAccount'
import AdminDashboard from './pages/admin/AdminDashboard'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/country/:countryId" element={<CountryDetails />} />
          <Route path="/visa/:countryId/:visaId" element={<VisaDetails />} />
          <Route path="/apply-with-documents" element={<ApplyWithDocuments />} />
          <Route path="/visa-application/:applicationId" element={<UserVisaDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App