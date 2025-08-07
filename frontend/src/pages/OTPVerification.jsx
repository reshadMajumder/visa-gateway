import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './css/OTPVerification.css'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">📧</div>
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Verify Your Email
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm sm:text-base font-semibold text-blue-600 break-all px-2">
              {email}
            </p>
          </div>

          {message && (
            <div className={`flex items-center justify-center space-x-2 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-sm sm:text-base ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <span className="text-lg">{messageType === 'success' ? '✅' : '❌'}</span>
              <span className="text-center">{message}</span>
            </div>
          )}

          <form className="space-y-6 sm:space-y-8" onSubmit={handleVerify}>
            <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength="1"
                  className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-center text-lg sm:text-xl lg:text-2xl font-bold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    digit 
                      ? 'border-blue-500 bg-blue-50 text-blue-900' 
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-600">
              <span className="text-lg">⏰</span>
              <span>Code expires in:</span>
              <span className="font-bold text-blue-600">{formatTime(timer)}</span>
            </div>

            <button
              type="submit"
              className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                !isOtpComplete || isVerifying
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-lg'
              }`}
              disabled={!isOtpComplete || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Didn't receive the code?
            </p>
            <button
              className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                canResend
                  ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleResend}
              disabled={!canResend}
            >
              {canResend ? 'Resend Code' : `Resend in ${formatTime(timer)}`}
            </button>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              to="/login"
              className="inline-flex items-center space-x-2 text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="text-lg">←</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification