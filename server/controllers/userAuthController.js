import User from '../models/User.js'
import { getOrCreateUser } from '../middleware/tokenMiddleware.js'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail, sendVerificationCode } from '../utils/emailService.js'
import logger from '../utils/logger.js'
import { OAuth2Client } from 'google-auth-library'

// Generate JWT token for users
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret-change-in-production', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// Generate verification code and expiry (shared between local + Google flows)
const createVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  return { code, expires }
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, sessionId, signupPurpose } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // Check if there's an existing session user to migrate
    let existingUser = null
    if (sessionId) {
      existingUser = await User.findOne({ sessionId })
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user or update existing session user
    let user
    const TRIAL_TOKENS = parseInt(process.env.TRIAL_TOKENS || '10', 10)

    if (existingUser && !existingUser.email) {
      // Migrate existing session user to registered user
      existingUser.email = email.toLowerCase()
      existingUser.password = password
      existingUser.emailVerified = false
      existingUser.verificationCode = verificationCode
      existingUser.verificationCodeExpires = verificationCodeExpires
      if (!existingUser.trialTokensGiven) {
        existingUser.tokens = (existingUser.tokens || 0) + TRIAL_TOKENS
        existingUser.trialTokensGiven = true
      }
      await existingUser.save()
      user = existingUser
    } else {
      // Create new user
      const userData = {
        email: email.toLowerCase(),
        password,
        emailVerified: false,
        verificationCode,
        verificationCodeExpires,
        tokens: TRIAL_TOKENS,
        trialTokensGiven: true,
        signupPurpose: signupPurpose || null,
        progress: {
          level: 1,
          points: 10, // Starting points for signup
          achievements: ['welcome'],
          streak: 1,
          lastActiveDate: new Date(),
        },
      }
      
      // Only include sessionId if it's provided (not null/undefined)
      // This prevents duplicate key errors with the sparse unique index
      if (sessionId) {
        userData.sessionId = sessionId
      }
      
      user = await User.create(userData)
    }

    // Send verification code email asynchronously (don't block registration)
    sendVerificationCode(user.email, verificationCode)
      .then((result) => {
        if (!result.success) {
          console.error('Failed to send verification email:', result.error)
        }
      })
      .catch((err) => console.error('Error sending verification email:', err))

    // Don't generate token yet - user needs to verify email first
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      email: user.email,
      requiresVerification: true,
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'register' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user',
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if email is verified (only for local auth, Google users are auto-verified)
    if (user.authProvider === 'local' && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in. Check your inbox for the verification code.',
        requiresVerification: true,
        email: user.email,
      })
    }

    // Update last activity
    user.lastActivity = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'login' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login',
    })
  }
}

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        trialTokensGiven: user.trialTokensGiven,
        totalTokensPurchased: user.totalTokensPurchased,
        totalTokensUsed: user.totalTokensUsed,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'getMe' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user',
    })
  }
}

// @desc    Authenticate with Google OAuth
// @route   POST /api/users/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required',
      })
    }

    // Check if Google Client ID is configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      logger.error('Google OAuth Client ID is not configured')
      return res.status(500).json({
        success: false,
        message: 'Google authentication is not properly configured. Please contact support.',
      })
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    // Verify the token
    let ticket
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      })
    }

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google',
      })
    }

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId })

    if (!user) {
      // Check if user exists with this email (for account linking)
      user = await User.findOne({ email: email.toLowerCase() })

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId
        user.authProvider = 'google'
        user.emailVerified = true // Mark email as verified for linked Google accounts
        // Update profile info if not set
        if (!user.preferences?.displayName && name) {
          if (!user.preferences) user.preferences = {}
          user.preferences.displayName = name
        }
        await user.save()
      } else {
        // Create new user with Google account
        const TRIAL_TOKENS = parseInt(process.env.TRIAL_TOKENS || '10', 10)
        const userData = {
          email: email.toLowerCase(),
          googleId,
          authProvider: 'google',
          emailVerified: true, // Google already verifies emails
          tokens: TRIAL_TOKENS,
          trialTokensGiven: true,
          progress: {
            level: 1,
            points: 10, // Starting points for signup
            achievements: ['welcome'],
            streak: 1,
            lastActiveDate: new Date(),
          },
        }

        if (name || picture) {
          userData.preferences = {}
          if (name) userData.preferences.displayName = name
          // Could store picture URL if needed
        }

        user = await User.create(userData)
      }
    } else {
      // Update last activity for existing user
      user.lastActivity = new Date()
      // Ensure email is marked as verified for existing Google users
      if (user.authProvider === 'google' && !user.emailVerified) {
        user.emailVerified = true
      }
      await user.save()
    }

    // Google users don't need email verification - Google already verifies emails

    // Generate JWT token
    const jwtToken = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
        authProvider: user.authProvider,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'googleAuth' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to authenticate with Google',
    })
  }
}

// @desc    Verify email with code
// @route   POST /api/users/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required',
      })
    }

    // Find user with verification code
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+verificationCode +verificationCodeExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      })
    }

    // Check if verification code exists
    if (!user.verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      })
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      })
    }

    // Check if code has expired
    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      })
    }

    // Verify email
    user.emailVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpires = undefined
    await user.save()

    // Send welcome email asynchronously (don't block verification)
    if (!user.welcomeEmailSent) {
      sendWelcomeEmail(user.email, user.signupPurpose)
        .then((result) => {
          if (result.success) {
            User.findByIdAndUpdate(user._id, { welcomeEmailSent: true })
              .catch((err) => console.error('Error updating welcomeEmailSent:', err))
          }
        })
        .catch((err) => console.error('Error sending welcome email:', err))
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
        tokens: user.tokens,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'verifyEmail' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify email',
    })
  }
}

// @desc    Resend verification code
// @route   POST /api/users/resend-verification
// @access  Public
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a verification code has been sent.',
      })
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      })
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with new code
    user.verificationCode = verificationCode
    user.verificationCodeExpires = verificationCodeExpires
    await user.save()

    // Send verification code email asynchronously
    sendVerificationCode(user.email, verificationCode)
      .then((result) => {
        if (!result.success) {
          console.error('Failed to send verification email:', result.error)
        }
      })
      .catch((err) => console.error('Error sending verification email:', err))

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'resendVerificationCode' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend verification code',
    })
  }
}

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      })
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Verify current password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'No password set for this account',
      })
    }

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'changePassword' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password',
    })
  }
}

