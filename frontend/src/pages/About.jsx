import { Shield, Users, Globe, Award, Target, Heart, Lightbulb, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'
import Button from '../components/ui/Button'

const About = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/all-destinations')
  }

  const stats = [
    { number: '50,000+', label: 'Visas Processed', icon: CheckCircle },
    { number: '98%', label: 'Success Rate', icon: Award },
    { number: '50+', label: 'Countries Covered', icon: Globe },
    { number: '15+', label: 'Years Experience', icon: Shield }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all our dealings.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for perfection in every visa application we handle.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Your success is our priority. We provide personalized service to meet your needs.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously improve our processes to provide faster and better service.',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      experience: '15+ years in immigration law',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      experience: '12+ years in visa processing',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Senior Consultant',
      experience: '10+ years in student visas',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]








  return (
    <div className="w-[85vw] mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 roundeda-xl">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 sm:py-16 lg:py-20 xl:py-24 mt-4 sm:mt-6 rounded-xl mx-2 sm:mx-0">
        <div className="absolute inset-0 bg-black opacity-10 rounded-xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <Globe className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 text-primary-200" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 px-4">
              About Schengen
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-primary-100 max-w-3xl mx-auto px-4">
              Your trusted partner for visa services worldwide with over 15 years of experience 
              helping dreams become reality.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            <div className="animate-slide-up order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Story
              </h2>
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg lg:text-xl text-gray-600">
                <p className="leading-relaxed">
                  Founded in 2008, Schengen has been helping thousands of travelers, students, 
                  and professionals achieve their international dreams. We specialize in providing 
                  comprehensive visa services for over 50 countries worldwide.
                </p>
                <p className="leading-relaxed">
                  Our team of experienced visa consultants and immigration experts work tirelessly 
                  to ensure your visa application process is smooth, efficient, and successful. 
                  With a 98% success rate, we pride ourselves on delivering exceptional service.
                </p>
                <p className="leading-relaxed">
                  From humble beginnings with just 3 employees, we've grown to become one of the 
                  most trusted visa service providers, processing over 50,000 applications and 
                  helping clients achieve their dreams across the globe.
                </p>
              </div>
              <div className="mt-6 sm:mt-8">
                <Button variant="primary" size="lg" icon={Target} className="w-full sm:w-auto">
                  Our Mission
                </Button>
              </div>
            </div>
            <div className="animate-slide-up lg:animate-slide-left order-1 lg:order-2">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Our team working together"
                  className="w-full h-64 sm:h-80 lg:h-96 xl:h-[28rem] object-cover rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Our Impact in Numbers
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              These numbers represent real people whose lives we've helped transform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              These principles guide everything we do and ensure we deliver 
              the highest quality service to every client.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn('w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6', value.color)}>
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Meet Our Expert Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Our experienced professionals are here to guide you through every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-block mb-4 sm:mb-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover mx-auto shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-600/20 to-transparent"></div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-semibold mb-2 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {member.experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white mx-2 sm:mx-0 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 px-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of satisfied clients who have trusted us with their visa applications. 
              Let's make your travel dreams a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-primary-600 w-full sm:w-auto hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={handleGetStarted}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section> */}
      
    </div>
  )
}

export default About