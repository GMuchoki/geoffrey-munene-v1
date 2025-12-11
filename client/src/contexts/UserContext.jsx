import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { userAPI } from '../services/api'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userAPI.getMe()
      if (response.success) {
        setUser(response.user)
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('userToken')
        setUser(null)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      // Token might be invalid, clear it
      localStorage.removeItem('userToken')
      setUser(null)
      setError(err.response?.data?.message || 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }, [])

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [fetchUser])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userAPI.login(email, password)
      if (response.success) {
        localStorage.setItem('userToken', response.token)
        setUser(response.user)
        return { success: true }
      } else {
        const message = response.message || 'Login failed'
        setError(message)
        return { success: false, message }
      }
    } catch (err) {
      console.error('Login error:', err)
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your connection.'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, sessionId = null, signupPurpose = null) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userAPI.register(email, password, sessionId, signupPurpose)
      if (response.success) {
        localStorage.setItem('userToken', response.token)
        setUser(response.user)
        return { success: true }
      } else {
        const message = response.message || 'Registration failed'
        setError(message)
        return { success: false, message }
      }
    } catch (err) {
      console.error('Registration error:', err)
      const message = err.response?.data?.message || err.message || 'Registration failed. Please check your connection.'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (token) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userAPI.googleAuth(token)
      if (response.requiresVerification) {
        // Google users must verify email before issuing a token
        const message =
          response.message || 'Please verify your email to continue.'
        setError(message)
        return {
          success: false,
          requiresVerification: true,
          email: response.email,
          message,
        }
      }

      if (response.success) {
        localStorage.setItem('userToken', response.token)
        setUser(response.user)
        return { success: true }
      } else {
        const message = response.message || 'Google authentication failed'
        setError(message)
        return { success: false, message }
      }
    } catch (err) {
      console.error('Google login error:', err)
      const message = err.response?.data?.message || err.message || 'Google authentication failed. Please try again.'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('userToken')
    setUser(null)
    // Navigation will be handled by components that call logout
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    fetchUser,
    isAuthenticated: !!user,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

