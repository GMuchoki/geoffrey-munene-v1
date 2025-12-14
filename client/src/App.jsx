import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import { TokenProvider } from './contexts/TokenContext'
import { logDiagnostics } from './utils/googleOAuthDiagnostic.js'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Tools from './pages/Tools'
import Learn from './pages/Learn'
import RemoteJobs from './pages/RemoteJobs'
import JobDetail from './pages/JobDetail'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Community from './pages/Community'
import ForumThreadDetail from './pages/ForumThreadDetail'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/user/Profile'
import Settings from './pages/user/Settings'
import Billing from './pages/user/Billing'
import ReEngagementBanner from './components/ReEngagementBanner'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminBlogForm from './pages/admin/AdminBlogForm'
import AdminJobs from './pages/admin/AdminJobs'
import AdminJobForm from './pages/admin/AdminJobForm'
import AdminContacts from './pages/admin/AdminContacts'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminTestimonialForm from './pages/admin/AdminTestimonialForm'
import AdminForums from './pages/admin/AdminForums'
import AdminForumForm from './pages/admin/AdminForumForm'
import AdminAdmins from './pages/admin/AdminAdmins'
import AdminAdminForm from './pages/admin/AdminAdminForm'
import DevTools from './pages/admin/DevTools'
import ProtectedRoute from './components/ProtectedRoute'
import UserProtectedRoute from './components/UserProtectedRoute'
import SubscriptionProtectedRoute from './components/SubscriptionProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import GoogleAnalytics from './components/GoogleAnalytics'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/app.css'

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  // Warn if Google Client ID is missing and run diagnostics
  useEffect(() => {
    if (!googleClientId) {
      console.warn(
        '⚠️ Google OAuth Client ID is missing. Google Sign-In will not work.\n' +
        'Please set VITE_GOOGLE_CLIENT_ID in your client/.env file.\n' +
        'See GOOGLE_OAUTH_SETUP.md for instructions.'
      )
    } else {
      // Run diagnostics in development
      if (import.meta.env.DEV) {
        logDiagnostics()
      }
    }
  }, [googleClientId])

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeProvider>
            <UserProvider>
              <TokenProvider>
                <AuthProvider>
                  <Router
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
              <GoogleAnalytics />
              <ReEngagementBanner />
          <Routes>
            {/* Public routes with navbar and footer */}
            <Route
              path="/*"
              element={
                <div className="app-container">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      {/* Public tools page - shows tools but requires login to use */}
                      <Route path="/tools" element={<Tools />} />
                      {/* Public learn page - free content only */}
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/remote-jobs" element={<RemoteJobs />} />
                      <Route path="/remote-jobs/:id" element={<JobDetail />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/community/thread/:id" element={<ForumThreadDetail />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      {/* Redirect old /dashboard route to /user/dashboard for backward compatibility */}
                      <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
                      {/* User-specific routes - require authentication */}
                      <Route
                        path="/user/dashboard"
                        element={
                          <UserProtectedRoute>
                            <UserDashboard />
                          </UserProtectedRoute>
                        }
                      />
                      {/* User tools page - authenticated users */}
                      <Route
                        path="/user/tools"
                        element={
                          <UserProtectedRoute>
                            <Tools />
                          </UserProtectedRoute>
                        }
                      />
                      {/* User learn page - can include paid courses */}
                      <Route
                        path="/user/learn"
                        element={
                          <UserProtectedRoute>
                            <Learn />
                          </UserProtectedRoute>
                        }
                      />
                      {/* User profile page */}
                      <Route
                        path="/user/profile"
                        element={
                          <UserProtectedRoute>
                            <Profile />
                          </UserProtectedRoute>
                        }
                      />
                      {/* User settings page */}
                      <Route
                        path="/user/settings"
                        element={
                          <UserProtectedRoute>
                            <Settings />
                          </UserProtectedRoute>
                        }
                      />
                      {/* User billing page */}
                      <Route
                        path="/user/billing"
                        element={
                          <UserProtectedRoute>
                            <Billing />
                          </UserProtectedRoute>
                        }
                      />
                      {/* Example: Protected course route (for future paid courses) */}
                      {/* <Route
                        path="/user/learn/course/:courseSlug"
                        element={
                          <SubscriptionProtectedRoute requiredTier="premium" courseId=":courseSlug">
                            <CourseDetail />
                          </SubscriptionProtectedRoute>
                        }
                      /> */}
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
            
            {/* Admin routes without navbar/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs/new"
              element={
                <ProtectedRoute>
                  <AdminBlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminBlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/new"
              element={
                <ProtectedRoute>
                  <AdminJobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminJobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials/new"
              element={
                <ProtectedRoute>
                  <AdminTestimonialForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminTestimonialForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forums"
              element={
                <ProtectedRoute>
                  <AdminForums />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forums/new"
              element={
                <ProtectedRoute>
                  <AdminForumForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forums/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminForumForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute>
                  <AdminAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins/new"
              element={
                <ProtectedRoute>
                  <AdminAdminForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminAdminForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dev-tools"
              element={
                <ProtectedRoute>
                  <DevTools />
                </ProtectedRoute>
              }
            />
          </Routes>
          </Router>
              </AuthProvider>
            </TokenProvider>
          </UserProvider>
      </ThemeProvider>
        </GoogleOAuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App

