import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { logDiagnostics } from '../utils/googleAnalyticsDiagnostic'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// Track if GA has been initialized to prevent duplicate loading
let isGAInitialized = false
let isScriptLoading = false

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Google Analytics: VITE_GA_MEASUREMENT_ID is not set')
    }
    return false
  }

  // Prevent duplicate initialization
  if (isGAInitialized || window.gtag) {
    return true
  }

  // Prevent duplicate script loading
  if (isScriptLoading) {
    return false
  }

  isScriptLoading = true

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  function gtag(...args) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  
  script.onload = () => {
    isGAInitialized = true
    isScriptLoading = false
    
    // Configure GA after script loads
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      page_title: document.title,
      send_page_view: true,
    })

    if (import.meta.env.DEV) {
      console.log('✅ Google Analytics initialized:', GA_MEASUREMENT_ID)
    }
  }

  script.onerror = () => {
    isScriptLoading = false
    console.error('❌ Failed to load Google Analytics script')
  }

  document.head.appendChild(script)
  return true
}

// Track page views
export const trackPageView = (path, title) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return false
  
  // Wait for gtag to be available
  if (!window.gtag) {
    // Retry after a short delay if gtag isn't ready
    setTimeout(() => trackPageView(path, title), 100)
    return false
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    })
    return true
  } catch (error) {
    console.error('Error tracking page view:', error)
    return false
  }
}

// Track events
export const trackEvent = (action, category, label, value) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    if (import.meta.env.DEV) {
      console.warn('Google Analytics: Cannot track event - GA not initialized')
    }
    return false
  }

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
    return true
  } catch (error) {
    console.error('Error tracking event:', error)
    return false
  }
}

// Verify GA is working
export const verifyGA = () => {
  const checks = {
    measurementId: !!GA_MEASUREMENT_ID,
    gtagLoaded: typeof window !== 'undefined' && !!window.gtag,
    dataLayerExists: typeof window !== 'undefined' && !!window.dataLayer,
    scriptLoaded: typeof document !== 'undefined' && 
      !!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`),
  }

  const allPassed = Object.values(checks).every(Boolean)
  
  if (import.meta.env.DEV) {
    console.log('📊 Google Analytics Status:', {
      ...checks,
      status: allPassed ? '✅ Working' : '⚠️ Issues detected',
      measurementId: GA_MEASUREMENT_ID ? `${GA_MEASUREMENT_ID.substring(0, 10)}...` : 'Not set',
    })
  }

  return { checks, allPassed }
}

// Component to track page views on route changes
export const GoogleAnalytics = () => {
  const location = useLocation()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (GA_MEASUREMENT_ID && !initializedRef.current) {
      initGA()
      initializedRef.current = true
      
      // Verify after initialization (only in development)
      if (import.meta.env.DEV) {
        setTimeout(() => {
          verifyGA()
          logDiagnostics()
        }, 1000)
      }
    } else if (!GA_MEASUREMENT_ID && import.meta.env.DEV) {
      console.warn(
        '⚠️ Google Analytics: VITE_GA_MEASUREMENT_ID is not set.\n' +
        'Add it to your client/.env file to enable analytics tracking.'
      )
    }
  }, [])

  useEffect(() => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        trackPageView(location.pathname + location.search, document.title)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [location])

  return null
}

export default GoogleAnalytics

