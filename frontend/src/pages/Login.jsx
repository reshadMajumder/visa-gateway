import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authService.login(formData)
      console.log('Login successful:', response)
      navigate('/dashboard') // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.detail || 'Invalid email or password')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-logo">
              <div className="login-logo-icon">✈️</div>
              <h2 className="login-logo-text">VisaGlobal</h2>
            </div>
            <h3 className="login-welcome">Welcome Back!</h3>
            <p className="login-description">
              Access your visa applications and track your journey to your dream destination.
            </p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-button">
              <span>📧</span>
              Google
            </button>
            <button className="social-button">
              <span>📘</span>
              Facebook
            </button>
          </div>
          
          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login