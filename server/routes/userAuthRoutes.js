import express from 'express'
import { register, login, getMe, changePassword, googleAuth, verifyEmail, resendVerificationCode } from '../controllers/userAuthController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/auth/google', googleAuth)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationCode)

// Protected routes
router.get('/me', protect, getMe)
router.put('/password', protect, changePassword)

export default router

