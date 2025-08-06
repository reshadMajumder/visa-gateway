import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Globe, Calendar } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { cn } from '../lib/utils'

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    visaType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      visaType: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: ['123 Business Center', 'Downtown District', 'New York, NY 10001'],
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@Schengen.com', 'support@Schengen.com'],
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 text-blue-200 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Contact Our Visa Experts
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
              Get personalized assistance for your visa application journey. 
              Our team is here to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 lg:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Get In Touch
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Ready to start your visa application? Our experienced team is here to help 
                  you every step of the way. Contact us today for a free consultation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row lg:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-4 p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={cn('p-3 rounded-lg flex-shrink-0 mx-auto sm:mx-0', item.color)}>
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="text-center sm:text-left w-full">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <div className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-sm sm:text-base text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact Actions */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center lg:text-left">Need Immediate Help?</h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    icon={Phone}
                    className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto justify-center"
                  >
                    Call Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    icon={MessageCircle}
                    className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto justify-center"
                  >
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-8 order-first lg:order-last">
              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6 sm:mb-8 text-center lg:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Send us a Message
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Fill out the form below and we'll respond as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                      />
                      <Input
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      icon={Mail}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      icon={Phone}
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Country of Interest <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full pl-8 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        >
                          <option value="">Select a country</option>
                          <option value="usa">🇺🇸 United States</option>
                          <option value="canada">🇨🇦 Canada</option>
                          <option value="uk">🇬🇧 United Kingdom</option>
                          <option value="australia">🇦🇺 Australia</option>
                          <option value="germany">🇩🇪 Germany</option>
                          <option value="france">🇫🇷 France</option>
                          <option value="japan">🇯🇵 Japan</option>
                          <option value="singapore">🇸🇬 Singapore</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Visa Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <select
                          name="visaType"
                          value={formData.visaType}
                          onChange={handleChange}
                          required
                          className="w-full pl-8 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        >
                          <option value="">Select visa type</option>
                          <option value="tourist">🏖️ Tourist Visa</option>
                          <option value="business">💼 Business Visa</option>
                          <option value="student">🎓 Student Visa</option>
                          <option value="work">🏢 Work Visa</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us about your travel plans and any specific questions you have..."
                        required
                        className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      icon={Send}
                      className="w-full justify-center"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact