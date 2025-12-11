import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { userAPI } from '../services/api'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import '../styles/pages/login.css'

function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get email from location state or redirect
    if (location.state?.email) {
      setEmail(location.state.email)
    } else if (!email) {
      // If no email in state, redirect to signup
      navigate('/signup')
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/user/dashboard')
    }
  }, [location, navigate, isAuthenticated, email])

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setCode(newCode)
      // Focus last input
      const lastInput = document.getElementById('code-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Email is required')
      return
    }

    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)

    try {
      const result = await userAPI.verifyEmail(email, verificationCode)
      if (result.success) {
        toast.success('Email verified successfully!')
        // Store token and redirect
        localStorage.setItem('userToken', result.token)
        navigate('/user/dashboard', { replace: true })
        // Reload to update user context
        window.location.reload()
      } else {
        toast.error(result.message || 'Verification failed')
        // Clear code on error
        setCode(['', '', '', '', '', ''])
        document.getElementById('code-0')?.focus()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.')
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setResending(true)

    try {
      const result = await userAPI.resendVerificationCode(email)
      if (result.success) {
        toast.success('Verification code sent! Check your email.')
      } else {
        toast.error(result.message || 'Failed to resend code')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <SEO
        title="Verify Email - AI Career Tools"
        description="Verify your email address to complete registration"
        url="/verify-email"
      />
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Verify Your Email</h1>
            <p className="login-subtitle">
              We've sent a 6-digit verification code to<br />
              <strong>{email || 'your email'}</strong>
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="code-0">Verification Code</label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={loading}
                      className="verification-code-input"
                      style={{
                        width: '50px',
                        height: '60px',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '0',
                      }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <small className="form-hint" style={{ textAlign: 'center', display: 'block', marginTop: '10px' }}>
                  Enter the 6-digit code from your email
                </small>
              </div>

              <button type="submit" disabled={loading || code.join('').length !== 6} className="login-button">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !email}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: resending || !email ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  opacity: resending || !email ? 0.5 : 1,
                }}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            <div className="login-footer">
              <p>
                Need to change your email?{' '}
                <Link to="/signup" className="login-link">
                  Sign up again
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyEmail

