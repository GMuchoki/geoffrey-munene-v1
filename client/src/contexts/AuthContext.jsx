import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await adminAPI.getMe()
      if (response.success) {
        setAdmin(response.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/46da804e-cefa-40d4-bfb3-c261e0da36f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C',location:'client/src/contexts/AuthContext.jsx:checkAuth',message:'checkAuth failed',data:{status:error.response?.status||null,reason:error.message},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await adminAPI.login({ username, password })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/46da804e-cefa-40d4-bfb3-c261e0da36f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B',location:'client/src/contexts/AuthContext.jsx:login',message:'admin login response',data:{success:response?.success===true,hasToken:!!response?.token,adminId:response?.admin?._id??null},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
      if (response.success) {
        localStorage.setItem('adminToken', response.token)
        setAdmin(response.admin)
        setIsAuthenticated(true)
        return { success: true, admin: response.admin }
      }
      return { success: false, message: response.message || 'Login failed' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

