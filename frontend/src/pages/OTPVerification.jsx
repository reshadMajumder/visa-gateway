import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './OTPVerification.css'

const OTPVerification = () => {
  const location = useLocation()
  const email = location.state?.email || 'user@example.com'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300) // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  
  const inputRefs = useRef([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }
    
    setOtp(newOtp)
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '')
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setMessage('Please enter all 6 digits')
      setMessageType('error')
      return
    }

    setIsVerifying(true)
    setMessage('')
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      
      // Simulate verification (in real app, this would be an API call)
      if (otpString === '123456') {
        setMessage('Email verified successfully! Redirecting...')
        setMessageType('success')
        
        // Redirect after success
        setTimeout(() => {
          // In real app, redirect to dashboard or login
          console.log('Verification successful')
        }, 2000)
      } else {
        setMessage('Invalid OTP. Please try again.')
        setMessageType('error')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    }, 2000)
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimer(300)
    setMessage('New OTP sent to your email')
    setMessageType('success')
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    // Simulate API call
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-header">
          <div className="otp-icon">📧</div>
          <h1 className="otp-title">Verify Your Email</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to
          </p>
          <p className="otp-email">{email}</p>
        </div>

        {message && (
          <div className={`${messageType}-message`}>
            <span>{messageType === 'success' ? '✅' : '❌'}</span>
            {message}
          </div>
        )}

        <form className="otp-form" onSubmit={handleVerify}>
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength="1"
                className={`otp-input ${digit ? 'filled' : ''}`}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoComplete="off"
              />
            ))}
          </div>

          <div className="otp-timer">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">Code expires in:</span>
            <span className="timer-countdown">{formatTime(timer)}</span>
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={!isOtpComplete || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="resend-section">
          <p className="resend-text">Didn't receive the code?</p>
          <button
            className="resend-button"
            onClick={handleResend}
            disabled={!canResend}
          >
            {canResend ? 'Resend Code' : `Resend in ${formatTime(timer)}`}
          </button>
        </div>

        <div className="back-to-login">
          <Link to="/login">
            <span>←</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification