import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    // Email for registered users (required for authenticated users)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null
      index: true, // Index for faster lookups
    },
    // Password for authenticated users
    password: {
      type: String,
      minlength: 8,
      select: false, // Don't return password by default
    },
    // Session-based identifier (for backward compatibility, optional)
    sessionId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    // Google OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', null],
      default: null,
    },
    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false, // Don't return by default
    },
    verificationCodeExpires: {
      type: Date,
      select: false,
    },
    // Token balance
    tokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Track if user has received trial tokens
    trialTokensGiven: {
      type: Boolean,
      default: false,
    },
    // Track total tokens ever purchased
    totalTokensPurchased: {
      type: Number,
      default: 0,
    },
    // Track total tokens used
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
    // Last activity timestamp
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    // Onboarding and preferences
    signupPurpose: {
      type: String,
      enum: ['coaching', 'tools', 'content', 'all', null],
      default: null,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingSteps: {
      profileSetup: { type: Boolean, default: false },
      firstToolUsed: { type: Boolean, default: false },
      firstContentGenerated: { type: Boolean, default: false },
      tokensPurchased: { type: Boolean, default: false },
      resourcesViewed: { type: Boolean, default: false },
    },
    preferences: {
      interests: [String],
      experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', null],
        default: null,
      },
      goals: [String],
      // Profile preferences
      displayName: String,
      bio: String,
      location: String,
      website: String,
      // Notification preferences
      emailNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      // General preferences
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      language: { type: String, default: 'en' },
      timezone: String,
    },
    progress: {
      level: { type: Number, default: 1 },
      points: { type: Number, default: 0 },
      achievements: [String],
      streak: { type: Number, default: 0 },
      lastActiveDate: Date,
    },
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    // Subscription and course access
    subscriptions: {
      activeCourses: [{
        courseId: String,
        courseSlug: String,
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 }, // 0-100
        completed: { type: Boolean, default: false },
        completedAt: Date,
      }],
      subscriptionTier: {
        type: String,
        enum: ['free', 'basic', 'premium', 'lifetime', null],
        default: null,
      },
      subscriptionStatus: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trial', null],
        default: null,
      },
      subscriptionExpiresAt: Date,
      subscriptionStartedAt: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) {
    this.lastActivity = new Date()
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.lastActivity = new Date()
  next()
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false
  }
  return await bcrypt.compare(enteredPassword, this.password)
}

// Update last activity before saving (for non-password updates)
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    this.lastActivity = new Date()
  }
  next()
})

const User = mongoose.model('User', userSchema)

export default User

