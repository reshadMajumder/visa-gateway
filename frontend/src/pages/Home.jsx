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
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center py-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Why Choose VisaGateway?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make visa applications simple, fast, and stress-free with our expert guidance and proven processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 text-center group hover:-translate-y-1 min-h-[280px] flex flex-col justify-between"
              >
                <div className="flex-1">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive visa services designed to make your international travel dreams a reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-8 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300 min-h-[250px] flex flex-col"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-800 text-white mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Visa Application?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have successfully obtained their visas with our expert assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
              Get Started Now
            </button>
            <button className="border border-gray-300 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 hover:text-slate-800 transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home