import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { API_ENDPOINTS } from '../config/api.js'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear errors when user starts typing
    if (error) setError('')
    
    // Check password match in real-time
    if (name === 'confirm_password' || name === 'password') {
      const password = name === 'password' ? value : formData.password
      const confirmPassword = name === 'confirm_password' ? value : formData.confirm_password
      setPasswordMatch(password === confirmPassword || confirmPassword === '')
    }
  }

  const validateForm = () => {
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          password2: formData.confirm_password,
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store tokens and user data in localStorage
        localStorage.setItem('accessToken', data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setSuccess('Account created successfully! Redirecting...')
        
        // Dispatch custom event to notify navbar of authentication change
        window.dispatchEvent(new Event('authStateChanged'))
        
        // Small delay to ensure event is processed before navigation
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setError(data.error || Object.values(data)[0]?.[0] || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Join us to start your visa journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm sm:text-base">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>

            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={!passwordMatch && formData.confirm_password ? 'Passwords do not match' : ''}
              required
            />

            {/* Password Requirements */}
            <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="mb-2 font-medium">Password must contain:</p>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li className={`flex items-center space-x-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{formData.password.length >= 8 ? '✓' : '○'}</span>
                  <span>At least 8 characters</span>
                </li>
                <li className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
                  <span>One uppercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{/[a-z]/.test(formData.password) ? '✓' : '○'}</span>
                  <span>One lowercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{/\d/.test(formData.password) ? '✓' : '○'}</span>
                  <span>One number</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start space-x-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={UserPlus}
              className="w-full justify-center"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Social Login Options */}
          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup