import axios from 'axios'
import { logApiError } from '../utils/errorTracking'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error tracking
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors
    if (error.config) {
      logApiError(error, error.config.url, error.config.method)
    }
    return Promise.reject(error)
  }
)

// Contact API
export const contactAPI = {
  sendMessage: async (data) => {
    const response = await api.post('/contact', data)
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },
}

// Blogs API
export const blogsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response.data
  },
}

// Tools API (now requires authentication)
export const toolsAPI = {
  generateResume: async (data) => {
    const response = await api.post('/tools/resume', data)
    return response.data
  },
  generateCoverLetter: async (data) => {
    const response = await api.post('/tools/cover-letter', data)
    return response.data
  },
  generateEmail: async (data) => {
    const response = await api.post('/tools/email', data)
    return response.data
  },
  generateInterviewPrep: async (data) => {
    const response = await api.post('/tools/interview-prep', data)
    return response.data
  },
  generateSkillsAssessment: async (data) => {
    const response = await api.post('/tools/skills-assessment', data)
    return response.data
  },
  generateSalaryNegotiation: async (data) => {
    const response = await api.post('/tools/salary-negotiation', data)
    return response.data
  },
}

// User Auth API
export const userAPI = {
  register: async (email, password, sessionId, signupPurpose = null) => {
    const response = await api.post('/users/register', { email, password, sessionId, signupPurpose })
    return response.data
  },
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password })
    return response.data
  },
  googleAuth: async (token) => {
    const response = await api.post('/users/auth/google', { token })
    return response.data
  },
  verifyEmail: async (email, code) => {
    const response = await api.post('/users/verify-email', { email, code })
    return response.data
  },
  resendVerificationCode: async (email) => {
    const response = await api.post('/users/resend-verification', { email })
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences)
    return response.data
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/password', { currentPassword, newPassword })
    return response.data
  },
  getOnboardingStatus: async () => {
    const response = await api.get('/users/onboarding')
    return response.data
  },
  updateOnboardingStep: async (step, completed) => {
    const response = await api.put('/users/onboarding/step', { step, completed })
    return response.data
  },
}

// User Content API
export const userContentAPI = {
  getContentHistory: async (page = 1, limit = 20, toolType = null) => {
    const params = { page, limit }
    if (toolType) params.toolType = toolType
    const response = await api.get('/user/content', { params })
    return response.data
  },
  getContentById: async (id) => {
    const response = await api.get(`/user/content/${id}`)
    return response.data
  },
  deleteContent: async (id) => {
    const response = await api.delete(`/user/content/${id}`)
    return response.data
  },
}

// Tokens API (now requires authentication)
export const tokensAPI = {
  getBalance: async () => {
    const response = await api.get('/tokens/balance')
    return response.data
  },
  getTransactions: async (limit = 20) => {
    const response = await api.get('/tokens/transactions', { params: { limit } })
    return response.data
  },
  initializePayment: async (tokenPackage) => {
    const response = await api.post('/tokens/initialize-payment', { tokenPackage })
    return response.data
  },
  verifyPayment: async (reference) => {
    const response = await api.post('/tokens/verify-payment', { reference })
    return response.data
  },
}

// YouTube API
export const youtubeAPI = {
  getVideos: async (channelUrl, maxResults = 10) => {
    const response = await api.get('/youtube/videos', {
      params: { channelUrl, maxResults },
    })
    return response.data
  },
  getPlaylists: async (channelUrl) => {
    const response = await api.get('/youtube/playlists', {
      params: { channelUrl },
    })
    return response.data
  },
}

// Jobs API
export const jobsAPI = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params })
    return response.data
  },
  getCategories: async () => {
    const response = await api.get('/jobs/categories')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },
}

// Testimonials API
export const testimonialsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/testimonials', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/testimonials/${id}`)
    return response.data
  },
}

// Community API
export const communityAPI = {
  // Community Posts
  getPosts: async (params = {}) => {
    const response = await api.get('/community/posts', { params })
    return response.data
  },
  createPost: async (data) => {
    const response = await api.post('/community/posts', data)
    return response.data
  },
  togglePostLike: async (postId) => {
    const response = await api.post(`/community/posts/${postId}/like`)
    return response.data
  },
  addPostComment: async (postId, content) => {
    const response = await api.post(`/community/posts/${postId}/comments`, { content })
    return response.data
  },
  deletePost: async (postId) => {
    const response = await api.delete(`/community/posts/${postId}`)
    return response.data
  },
  
  // Forums
  getForums: async () => {
    const response = await api.get('/community/forums')
    return response.data
  },
  getForumThreads: async (forumId, params = {}) => {
    const response = await api.get(`/community/forums/${forumId}/threads`, { params })
    return response.data
  },
  getForumThread: async (threadId) => {
    const response = await api.get(`/community/threads/${threadId}`)
    return response.data
  },
  createForumThread: async (forumId, data) => {
    const response = await api.post(`/community/forums/${forumId}/threads`, data)
    return response.data
  },
  addThreadReply: async (threadId, content) => {
    const response = await api.post(`/community/threads/${threadId}/replies`, { content })
    return response.data
  },
  
  // Events
  getEvents: async (params = {}) => {
    const response = await api.get('/community/events', { params })
    return response.data
  },
  createEvent: async (data) => {
    const response = await api.post('/community/events', data)
    return response.data
  },
  registerForEvent: async (eventId) => {
    const response = await api.post(`/community/events/${eventId}/register`)
    return response.data
  },
  
  // Resources
  getResources: async (params = {}) => {
    const response = await api.get('/community/resources', { params })
    return response.data
  },
  createResource: async (data) => {
    const response = await api.post('/community/resources', data)
    return response.data
  },
  
  // Showcase
  getShowcase: async (params = {}) => {
    const response = await api.get('/community/showcase', { params })
    return response.data
  },
  createShowcase: async (data) => {
    const response = await api.post('/community/showcase', data)
    return response.data
  },
}

// Admin API
export const adminAPI = {
  // Auth
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/admin/me')
    return response.data
  },
  
  // Blogs
  getAllBlogs: async () => {
    const response = await api.get('/admin/blogs')
    return response.data
  },
  getBlogById: async (id) => {
    const response = await api.get(`/admin/blogs/${id}`)
    return response.data
  },
  createBlog: async (data) => {
    const response = await api.post('/admin/blogs', data)
    return response.data
  },
  updateBlog: async (id, data) => {
    const response = await api.put(`/admin/blogs/${id}`, data)
    return response.data
  },
  deleteBlog: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`)
    return response.data
  },
  
  // Jobs
  getAllJobs: async () => {
    const response = await api.get('/admin/jobs')
    return response.data
  },
  getJobById: async (id) => {
    const response = await api.get(`/admin/jobs/${id}`)
    return response.data
  },
  createJob: async (data) => {
    const response = await api.post('/admin/jobs', data)
    return response.data
  },
  updateJob: async (id, data) => {
    const response = await api.put(`/admin/jobs/${id}`, data)
    return response.data
  },
  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`)
    return response.data
  },
  
  // Contacts
  getAllContacts: async () => {
    const response = await api.get('/admin/contacts')
    return response.data
  },
  getContactById: async (id) => {
    const response = await api.get(`/admin/contacts/${id}`)
    return response.data
  },
  updateContactStatus: async (id, status) => {
    const response = await api.put(`/admin/contacts/${id}`, { status })
    return response.data
  },
  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`)
    return response.data
  },
  
  // Testimonials
  getAllTestimonials: async () => {
    const response = await api.get('/admin/testimonials')
    return response.data
  },
  getTestimonialById: async (id) => {
    const response = await api.get(`/admin/testimonials/${id}`)
    return response.data
  },
  createTestimonial: async (data) => {
    const response = await api.post('/admin/testimonials', data)
    return response.data
  },
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/admin/testimonials/${id}`, data)
    return response.data
  },
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/admin/testimonials/${id}`)
    return response.data
  },
  
  // Forums
  getAllForums: async () => {
    const response = await api.get('/admin/forums')
    return response.data
  },
  getForumById: async (id) => {
    const response = await api.get(`/admin/forums/${id}`)
    return response.data
  },
  createForum: async (data) => {
    const response = await api.post('/admin/forums', data)
    return response.data
  },
  updateForum: async (id, data) => {
    const response = await api.put(`/admin/forums/${id}`, data)
    return response.data
  },
  deleteForum: async (id) => {
    const response = await api.delete(`/admin/forums/${id}`)
    return response.data
  },
  
  // Admin Management (Super Admin only)
  getAllAdmins: async () => {
    const response = await api.get('/admin/admins')
    return response.data
  },
  getAdminById: async (id) => {
    const response = await api.get(`/admin/admins/${id}`)
    return response.data
  },
  createAdmin: async (data) => {
    const response = await api.post('/admin/admins', data)
    return response.data
  },
  updateAdmin: async (id, data) => {
    const response = await api.put(`/admin/admins/${id}`, data)
    return response.data
  },
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/admins/${id}`)
    return response.data
  },
  changePassword: async (id, data) => {
    const response = await api.put(`/admin/admins/${id}/password`, data)
    return response.data
  },
  
  // Dev Tools (Dev, Admin, Super Admin)
  getSystemHealth: async () => {
    const response = await api.get('/admin/dev/health')
    return response.data
  },
  getDatabaseStats: async () => {
    const response = await api.get('/admin/dev/stats')
    return response.data
  },
  getErrorLogs: async (limit = 50) => {
    const response = await api.get('/admin/dev/logs/errors', { params: { limit } })
    return response.data
  },
  getApiRequestLogs: async (limit = 100, filters = {}) => {
    const response = await api.get('/admin/dev/logs/requests', { params: { limit, ...filters } })
    return response.data
  },
  clearLogs: async (type = 'all') => {
    const response = await api.delete('/admin/dev/logs', { data: { type } })
    return response.data
  },
}

// Add token to requests if available (both admin and user tokens)
api.interceptors.request.use((config) => {
  // Check for user token first (for regular users)
  const userToken = localStorage.getItem('userToken')
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`
  } else {
    // Fallback to admin token (for admin routes)
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }
  }
  return config
})

export default api

