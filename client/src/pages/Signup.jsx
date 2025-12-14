import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { GoogleLogin } from '@react-oauth/google'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import { logDiagnostics } from '../utils/googleOAuthDiagnostic.js'
import { isValidPassword, isValidUsername, isValidName, isValidEmail } from '../utils/validators'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import '../styles/pages/login.css'

function Signup() {
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [signupPurpose, setSignupPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, googleLogin, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  // Check password requirements as user types
  const checkPasswordRequirements = (pwd) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[#?!@$%^&*.\-_]/.test(pwd),
    })
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordRequirements(newPassword)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      const result = await googleLogin(credentialResponse.credential, 'signup')
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

  const handleGoogleError = (error) => {
    console.error('Google signup error:', error)
    
    // Run diagnostics on error
    if (import.meta.env.DEV) {
      console.log('Running diagnostics due to Google signup error...')
      logDiagnostics()
    }
    
    if (error?.error === 'popup_closed_by_user') {
      toast.error('Sign-up was cancelled')
    } else if (error?.error === 'popup_blocked') {
      toast.error('Popup was blocked. Please allow popups for this site.')
    } else if (error?.error === 'access_denied') {
      toast.error('Access denied. Please try again or use email/password signup.')
    } else {
      toast.error('Google signup failed. Please try again.')
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

    // Validate required fields
    if (!firstName.trim()) {
      toast.error('First name is required')
      return
    }

    if (!isValidName(firstName)) {
      toast.error('First name must be 2-50 characters and contain only letters, spaces, or hyphens')
      return
    }

    if (!lastName.trim()) {
      toast.error('Last name is required')
      return
    }

    if (!isValidName(lastName)) {
      toast.error('Last name must be 2-50 characters and contain only letters, spaces, or hyphens')
      return
    }

    // Validate middle name if provided
    if (middleName.trim() && !isValidName(middleName)) {
      toast.error('Middle name must be 2-50 characters and contain only letters, spaces, or hyphens')
      return
    }

    if (!username.trim()) {
      toast.error('Username is required')
      return
    }

    if (!isValidUsername(username)) {
      toast.error('Username must be 3-20 characters and contain only letters, numbers, and underscores')
      return
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character')
      return
    }

    setLoading(true)

    try {
      // Get sessionId from localStorage if it exists (for migrating tokens)
      const sessionId = localStorage.getItem('userSessionId')
      
      const result = await register(
        firstName.trim(),
        middleName.trim() || null,
        lastName.trim(),
        username.trim().toLowerCase(),
        email.trim().toLowerCase(),
        password,
        sessionId,
        signupPurpose
      )
      if (result.success) {
        if (result.requiresVerification) {
          toast.success('Registration successful! Please check your email for verification code.')
          navigate('/verify-email', { 
            state: { email: result.email || email },
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
              <div className="name-fields-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    disabled={loading}
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    disabled={loading}
                    minLength={2}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name <span className="optional">(Optional)</span></label>
                <input
                  id="middleName"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Michael"
                  disabled={loading}
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username <span className="required">*</span></label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  placeholder="johndoe"
                  required
                  disabled={loading}
                  minLength={3}
                  maxLength={20}
                />
                <small className="form-hint">3-20 characters, letters, numbers, and underscores only</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
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
                <label htmlFor="password">Password <span className="required">*</span></label>
                <div className="password-input-wrapper">
                <input
                  id="password"
                    type={showPassword ? 'text' : 'password'}
                  value={password}
                    onChange={handlePasswordChange}
                  placeholder="At least 8 characters"
                  required
                  disabled={loading}
                  minLength={8}
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
                {password && (
                  <div className="password-requirements">
                    <div className={`requirement ${passwordRequirements.minLength ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">
                        {passwordRequirements.minLength ? '✓' : '✗'}
                      </span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.hasUpperCase ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">
                        {passwordRequirements.hasUpperCase ? '✓' : '✗'}
                      </span>
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.hasLowerCase ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">
                        {passwordRequirements.hasLowerCase ? '✓' : '✗'}
                      </span>
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.hasNumber ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">
                        {passwordRequirements.hasNumber ? '✓' : '✗'}
                      </span>
                      <span>One number</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.hasSpecialChar ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">
                        {passwordRequirements.hasSpecialChar ? '✓' : '✗'}
                      </span>
                      <span>One special character (#?!@$%^&*.-_)</span>
                    </div>
                  </div>
                )}
                {!password && (
                  <small className="form-hint">Must contain uppercase, lowercase, number, and special character</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  minLength={8}
                />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <HiEyeSlash /> : <HiEye />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <small className="form-error">Passwords do not match</small>
                )}
                {confirmPassword && password === confirmPassword && password && (
                  <small className="form-success">Passwords match</small>
                )}
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
                    text="signup_with"
                    shape="rectangular"
                  />
                </div>
              </>
            )}

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

