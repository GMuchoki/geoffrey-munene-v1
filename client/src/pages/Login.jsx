import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { GoogleLogin } from '@react-oauth/google'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import '../styles/pages/login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, googleLogin, isAuthenticated } = useUser()
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

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.')
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
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Login successful!')
        const from = location.state?.from?.pathname || '/user/dashboard'
        const search = location.state?.from?.search || ''
        navigate(`${from}${search}`, { replace: true })
      } else {
        // Check if email verification is required
        if (result.requiresVerification) {
          toast.error(result.message || 'Please verify your email address')
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
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Logging in...' : 'Login'}
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

