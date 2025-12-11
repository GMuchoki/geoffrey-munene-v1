import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { GoogleLogin } from '@react-oauth/google'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import '../styles/pages/login.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [signupPurpose, setSignupPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, googleLogin, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      const result = await googleLogin(credentialResponse.credential)
      if (result.requiresVerification) {
        toast.success(
          'Please verify your email. We sent a 6-digit code to your inbox.'
        )
        navigate('/verify-email', {
          state: { email: result.email },
          replace: false,
        })
      } else if (result.success) {
        toast.success(
          'Account created successfully! You received 10 free trial tokens.'
        )
        const from = location.state?.from?.pathname || '/user/dashboard'
        const search = location.state?.from?.search || ''
        navigate(`${from}${search}`, { replace: true })
      } else {
        toast.error(result.message || 'Google signup failed')
      }
    } catch (error) {
      toast.error('An error occurred during Google signup')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google signup failed. Please try again.')
  }

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/user/dashboard'
      const search = location.state?.from?.search || ''
      navigate(`${from}${search}`, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      // Get sessionId from localStorage if it exists (for migrating tokens)
      const sessionId = localStorage.getItem('userSessionId')
      
      const result = await register(email, password, sessionId, signupPurpose)
      if (result.success) {
        if (result.requiresVerification) {
          toast.success('Registration successful! Please check your email for verification code.')
          navigate('/verify-email', { 
            state: { email },
            replace: true 
          })
        } else {
          toast.success('Account created successfully! You received 10 free trial tokens.')
          const from = location.state?.from?.pathname || '/user/dashboard'
          const search = location.state?.from?.search || ''
          navigate(`${from}${search}`, { replace: true })
        }
      } else {
        toast.error(result.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Sign Up - AI Career Tools"
        description="Create an account to access AI-powered career tools and get free trial tokens"
        url="/signup"
      />
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Sign Up</h1>
            <p className="login-subtitle">Create an account and get 10 free trial tokens</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  disabled={loading}
                  minLength={8}
                />
                <small className="form-hint">Must be at least 8 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signupPurpose">What brings you here? (Optional)</label>
                <select
                  id="signupPurpose"
                  value={signupPurpose}
                  onChange={(e) => setSignupPurpose(e.target.value)}
                  disabled={loading}
                  className="form-select"
                >
                  <option value="">Select your main interest</option>
                  <option value="tools">AI Tools & Productivity</option>
                  <option value="coaching">Remote Work Coaching</option>
                  <option value="content">Content & Learning</option>
                  <option value="all">Everything - I want it all!</option>
                </select>
                <small className="form-hint">This helps us personalize your experience</small>
              </div>

              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>

            <div className="login-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup

