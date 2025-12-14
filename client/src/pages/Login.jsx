import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { GoogleLogin } from '@react-oauth/google'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import { logDiagnostics } from '../utils/googleOAuthDiagnostic.js'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import '../styles/pages/login.css'

function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, googleLogin, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      const result = await googleLogin(credentialResponse.credential, 'login')
      if (result.requiresVerification) {
        toast.success(
          'Please verify your email. We sent a 6-digit code to your inbox.'
        )
        navigate('/verify-email', {
          state: { email: result.email },
          replace: false,
        })
      } else if (result.success) {
        toast.success('Login successful!')
        const from = location.state?.from?.pathname || '/user/dashboard'
        const search = location.state?.from?.search || ''
        navigate(`${from}${search}`, { replace: true })
      } else {
        toast.error(result.message || 'Google login failed')
      }
    } catch (error) {
      toast.error('An error occurred during Google login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = (error) => {
    console.error('Google login error:', error)
    
    // Run diagnostics on error
    if (import.meta.env.DEV) {
      console.log('Running diagnostics due to Google login error...')
      logDiagnostics()
    }
    
    if (error?.error === 'popup_closed_by_user') {
      toast.error('Sign-in was cancelled')
    } else if (error?.error === 'popup_blocked') {
      toast.error('Popup was blocked. Please allow popups for this site.')
    } else if (error?.error === 'access_denied') {
      toast.error('Access denied. Please try again or use email/password login.')
    } else {
      toast.error('Google login failed. Please try again.')
      console.error('Full error details:', error)
    }
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
    
    if (!identifier.trim()) {
      toast.error('Please enter your email or username')
      return
    }
    
    if (!password) {
      toast.error('Please enter your password')
      return
    }
    
    setLoading(true)

    try {
      const result = await login(identifier.trim(), password)
      if (result.success) {
        toast.success('Login successful!')
        const from = location.state?.from?.pathname || '/user/dashboard'
        const search = location.state?.from?.search || ''
        navigate(`${from}${search}`, { replace: true })
      } else {
        // Check if email verification is required
        if (result.requiresVerification) {
          toast.error(result.message || 'Please verify your email address')
          // Extract email from identifier if it's an email, otherwise use the identifier
          const email = identifier.includes('@') ? identifier : result.email || identifier
          navigate('/verify-email', { 
            state: { email },
            replace: false 
          })
        } else {
          toast.error(result.message || 'Login failed')
        }
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Login - AI Career Tools"
        description="Login to access AI-powered career tools and manage your tokens"
        url="/login"
      />
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Access your account to use AI-powered tools</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="identifier">Email or Username</label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="your.email@example.com or username"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
                <small className="form-hint">You can login with your email address or username</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    minLength={8}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <HiEyeSlash /> : <HiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <>
                <div className="login-divider">
                  <span>OR</span>
                </div>

                <div className="google-login-wrapper">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>
              </>
            )}

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="login-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

