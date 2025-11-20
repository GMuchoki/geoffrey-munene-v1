import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/database.js'
import contactRoutes from './routes/contactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import toolsRoutes from './routes/toolsRoutes.js'
import tokenRoutes from './routes/tokenRoutes.js'
import youtubeRoutes from './routes/youtubeRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userAuthRoutes from './routes/userAuthRoutes.js'
import userContentRoutes from './routes/userContentRoutes.js'
import userOnboardingRoutes from './routes/userOnboardingRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import adminJobRoutes from './routes/adminJobRoutes.js'
import adminBlogRoutes from './routes/adminBlogRoutes.js'
import adminContactRoutes from './routes/adminContactRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import adminTestimonialRoutes from './routes/adminTestimonialRoutes.js'
import adminForumRoutes from './routes/adminForumRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import devToolsRoutes from './routes/devToolsRoutes.js'
import { logApiRequest } from './controllers/devToolsController.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Trust proxy - Required for Railway/Heroku and other reverse proxy setups
// This allows Express to correctly identify the client's IP address
app.set('trust proxy', 1)

// CORS configuration - MUST be before other middleware for preflight requests
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL,
      'https://geoffreymunene.netlify.app',
      'https://geoffreymunene.com',
      'https://www.geoffreymunene.com'
    ].filter(Boolean) // Remove any undefined values
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']

// Log allowed origins in production for debugging
if (process.env.NODE_ENV === 'production') {
  // Use logger when available, fallback to console for server startup
  console.log('CORS Allowed Origins:', allowedOrigins)
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, health checks, etc.)
    // This is safe because credentials are only sent when origin matches
    if (!origin) {
      return callback(null, true)
    }
    
    // In production, check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        // Log the rejected origin for debugging (but don't crash)
        // Use logger when available, fallback to console for CORS middleware
        console.warn(`CORS: Origin ${origin} not allowed. Allowed origins:`, allowedOrigins)
        callback(new Error(`CORS: Origin ${origin} not allowed`))
      }
    } else {
      // In development, allow localhost origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
  maxAge: 86400, // 24 hours
}))

// Security Middleware
// Helmet helps secure Express apps by setting various HTTP headers
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for images
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}

// In development, allow localhost connections
if (process.env.NODE_ENV === 'development') {
  helmetConfig.contentSecurityPolicy.directives.imgSrc.push("http:")
  helmetConfig.contentSecurityPolicy.directives.connectSrc.push(
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:3000"
  )
}

app.use(helmet(helmetConfig))

// Rate limiting
// More lenient in development, stricter in production
const isDevelopment = process.env.NODE_ENV === 'development'

// Lenient rate limiter for public read-only endpoints (blogs, testimonials, jobs)
const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 200, // Higher limit for public content
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
})

// Stricter rate limiter for auth endpoints (skip OPTIONS requests)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Skip preflight requests
})

// Stricter rate limiter for AI tools (more expensive)
const toolsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per hour
  message: 'Too many tool requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting (after CORS to allow preflight requests)
// IMPORTANT: More specific routes must come before general routes
// Public read-only endpoints get more lenient rate limiting
app.use('/api/blogs', publicReadLimiter)
app.use('/api/testimonials', publicReadLimiter)
app.use('/api/jobs', publicReadLimiter)
app.use('/api/youtube', publicReadLimiter)
app.use('/api/projects', publicReadLimiter)

// Stricter limiters for specific endpoints (must come before general limiter)
app.use('/api/admin/login', authLimiter)
app.use('/api/tools', toolsLimiter)

// General API rate limiter for other endpoints (excludes already matched routes)
// Skip public read-only endpoints and already rate-limited routes
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 1000 : 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip OPTIONS requests
    if (req.method === 'OPTIONS') return true
    // Skip public read-only endpoints (already have their own limiters)
    const publicPaths = ['/api/blogs', '/api/testimonials', '/api/jobs', '/api/youtube', '/api/projects']
    if (publicPaths.some(path => req.path.startsWith(path))) return true
    // Skip already rate-limited endpoints
    if (req.path.startsWith('/api/admin/login') || req.path.startsWith('/api/tools')) return true
    return false
  },
})
app.use('/api/', generalApiLimiter)

// Paystack webhook route (must be before JSON body parser)
// Paystack sends JSON body, so we use regular JSON parser
app.post('/api/tokens/webhook', express.json(), async (req, res, next) => {
  // Use the webhook handler directly
  const { handleWebhook } = await import('./controllers/tokenController.js')
  handleWebhook(req, res, next)
})

// Security: Limit request body size
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Middleware to log API requests (for dev tools) - must be after body parser
app.use((req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    // Only log admin API requests - check both originalUrl and path
    const urlToCheck = req.originalUrl || req.url || req.path
    if (urlToCheck.startsWith('/api/admin')) {
      try {
        logApiRequest(req, res, responseTime)
      } catch (error) {
        // Silently fail if logging fails
        // Use logger when available, fallback to console
        console.error('Failed to log API request:', error)
      }
    }
  })
  
  next()
})

// Routes
app.use('/api/contact', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/tokens', tokenRoutes)
app.use('/api/users', userAuthRoutes)
app.use('/api/users', userOnboardingRoutes)
app.use('/api/user', userContentRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/community', communityRoutes)

// Admin routes
app.use('/api/admin', authRoutes)
app.use('/api/admin/jobs', adminJobRoutes)
app.use('/api/admin/blogs', adminBlogRoutes)
app.use('/api/admin/contacts', adminContactRoutes)
app.use('/api/admin/testimonials', adminTestimonialRoutes)
app.use('/api/admin/forums', adminForumRoutes)
app.use('/api/admin/admins', adminRoutes)
app.use('/api/admin/dev', devToolsRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle CORS errors gracefully - but CORS middleware should handle its own errors
  // This is a fallback in case CORS errors slip through
  if (err.message && err.message.includes('CORS')) {
    // Set CORS headers even for errors
    const origin = req.headers.origin
    if (origin && allowedOrigins.indexOf(origin) !== -1) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
    return res.status(403).json({
      success: false,
      message: 'CORS: Request not allowed from this origin',
    })
  }
  
  // Use logger when available, fallback to console for error middleware
  console.error(err.stack)
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!', 
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  // Use logger when available, fallback to console for server startup
  console.log(`Server is running on port ${PORT}`)
})

