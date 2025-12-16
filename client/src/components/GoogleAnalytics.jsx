import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { logDiagnostics } from '../utils/googleAnalyticsDiagnostic'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// Track if GA has been initialized to prevent duplicate loading
let isGAInitialized = false
let isScriptLoading = false

// Initialize Google Analytics
export const initGA = () => {
  // Log the env var value for debugging (helps identify if it's undefined in production)
  if (typeof window !== 'undefined') {
    console.log('🔍 GA Debug - VITE_GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID || 'NOT SET')
    console.log('🔍 GA Debug - import.meta.env:', {
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
    })
  }
  
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    console.warn('⚠️ Google Analytics: VITE_GA_MEASUREMENT_ID is not set')
    console.warn('⚠️ This usually means the env var is missing in Netlify build environment')
    return false
  }

  // Check if script is already loaded from index.html
  const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
  const scriptAlreadyInHTML = existingScript !== null

  // Ensure dataLayer and gtag are initialized (may already be from index.html)
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    function gtag(...args) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag
    gtag('js', new Date())
  }

  // If script is already loaded from HTML, just configure it
  if (scriptAlreadyInHTML) {
    // Wait for the script to fully load, then configure
    const configureGA = () => {
      // Check if gtag is available and the script has loaded
      if (typeof window.gtag === 'function') {
        // Script is loaded, configure GA
        gtag('config', GA_MEASUREMENT_ID, {
          page_path: window.location.pathname,
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true,
          allow_google_signals: true,
          allow_ad_personalization_signals: true,
        })

        gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title,
          page_location: window.location.href,
        })

        isGAInitialized = true
        console.log('✅ Google Analytics initialized (from HTML):', GA_MEASUREMENT_ID)
        console.log('📤 Initial page view sent to GA')
        return true
      }
      return false
    }

    // Try immediately
    if (configureGA()) {
      return true
    }

    // Script might still be loading, wait for it
    const checkInterval = setInterval(() => {
      if (configureGA() || isGAInitialized) {
        clearInterval(checkInterval)
      }
    }, 50)

    // Stop checking after 5 seconds (script should load by then)
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!isGAInitialized) {
        console.warn('⚠️ Google Analytics script from HTML took too long to load')
      }
    }, 5000)

    return true
  }

  // Fallback: Load script dynamically if not in HTML (for development/testing)
  if (isGAInitialized) {
    return true
  }

  if (isScriptLoading) {
    return false
  }

  isScriptLoading = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  
  script.onload = () => {
    isGAInitialized = true
    isScriptLoading = false
    
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
    })

    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    })

    console.log('✅ Google Analytics initialized (dynamic):', GA_MEASUREMENT_ID)
    console.log('📤 Initial page view sent to GA')
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
      page_location: window.location.href,
    })
    
    // Also send as an event to ensure it's captured
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
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
    // GA4 event format - use custom parameters
    const eventParams = {
      event_category: category, // Keep for backward compatibility
      category: category, // GA4 recommended format
    }
    
    if (label) {
      eventParams.event_label = label // Keep for backward compatibility
      eventParams.label = label // GA4 recommended format
    }
    
    if (value !== undefined && value !== null) {
      eventParams.value = value
    }
    
    window.gtag('event', action, eventParams)
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
  
  // Log status in both dev and production for debugging
  console.log('📊 Google Analytics Status:', {
    ...checks,
    status: allPassed ? '✅ Working' : '⚠️ Issues detected',
    measurementId: GA_MEASUREMENT_ID ? `${GA_MEASUREMENT_ID.substring(0, 10)}...` : 'Not set',
    environment: import.meta.env.MODE,
  })

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
      
      // Verify after initialization (both dev and production)
      setTimeout(() => {
        verifyGA()
        if (import.meta.env.DEV) {
          logDiagnostics()
        }
      }, 1000)
    } else if (!GA_MEASUREMENT_ID) {
      // Log warning in both dev and production to help debug
      console.warn(
        '⚠️ Google Analytics: VITE_GA_MEASUREMENT_ID is not set.\n' +
        'Add it to your client/.env file (dev) or Netlify environment variables (production).'
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

