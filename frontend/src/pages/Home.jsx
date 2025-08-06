import { useNavigate } from 'react-router-dom'
import Banner from '../components/Banner'
import CountryCards from '../components/CountryCards'
import { 
  Shield, 
  Clock, 
  Users, 
  Award,
  CheckCircle,
  Globe,
  Headphones,
  FileCheck
} from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your documents and personal information are completely secure with our advanced encryption."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick turnaround times with most visas processed within 5-10 business days."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated visa specialists available 24/7 to assist you throughout the process."
    },
    {
      icon: Award,
      title: "High Success Rate",
      description: "98% approval rate with our comprehensive application review and guidance."
    }
  ]

  const stats = [
    { number: "50+", label: "Countries Covered" },
    { number: "10K+", label: "Visas Processed" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Expert Support" }
  ]

  const services = [
    {
      icon: FileCheck,
      title: "Document Review",
      description: "Comprehensive review of all your documents before submission to ensure completeness and accuracy."
    },
    {
      icon: Globe,
      title: "Multiple Countries",
      description: "Visa services for 50+ countries including USA, Canada, UK, Australia, and Schengen nations."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to answer your questions and provide updates on your application."
    }
  ]

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section - Keep existing Banner */}
      <Banner />
      
      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center py-3 sm:py-4 lg:py-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-800 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base px-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-800 mb-3 sm:mb-4 px-4">
              Why Choose VisaGateway?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We make visa applications simple, fast, and stress-free with our expert guidance and proven processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 text-center group hover:-translate-y-1 min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] flex flex-col justify-between"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary-200 transition-colors">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-800 mb-2 sm:mb-3 px-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <CountryCards />

      {/* Services Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-800 mb-3 sm:mb-4 px-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive visa services designed to make your international travel dreams a reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-4 sm:p-6 lg:p-8 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] flex flex-col"
              >
                <div className="flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-800 mb-2 sm:mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 px-4">
            Ready to Start Your Visa Application?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who have successfully obtained their visas with our expert assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button 
              onClick={() => navigate('/all-destinations')}
              className="bg-white text-primary-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home