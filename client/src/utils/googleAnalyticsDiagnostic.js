/**
 * Google Analytics Diagnostic Utility
 * Use this to debug Google Analytics tracking issues
 */

export const diagnoseGoogleAnalytics = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  const diagnostics = {
    measurementId: GA_MEASUREMENT_ID,
    currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'N/A',
    issues: [],
    recommendations: [],
    status: 'unknown',
  }

  // Check 1: Measurement ID exists
  if (!GA_MEASUREMENT_ID) {
    diagnostics.issues.push('❌ VITE_GA_MEASUREMENT_ID is not set in environment variables')
    diagnostics.recommendations.push('Add VITE_GA_MEASUREMENT_ID to client/.env file')
    diagnostics.recommendations.push('Format: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX')
    diagnostics.status = 'error'
  } else {
    diagnostics.issues.push(`✅ Measurement ID is set: ${GA_MEASUREMENT_ID}`)
    
    // Check format (GA4 format: G-XXXXXXXXXX)
    if (!GA_MEASUREMENT_ID.match(/^G-[A-Z0-9]+$/i) && !GA_MEASUREMENT_ID.match(/^UA-\d+-\d+$/)) {
      diagnostics.issues.push('⚠️ Measurement ID format may be incorrect')
      diagnostics.recommendations.push('GA4 format should be: G-XXXXXXXXXX')
      diagnostics.recommendations.push('Universal Analytics format: UA-XXXXXXXXX-X')
    }
  }

  // Check 2: Window object available (client-side)
  if (typeof window === 'undefined') {
    diagnostics.issues.push('❌ Window object not available (running server-side?)')
    diagnostics.status = 'error'
    return diagnostics
  }

  // Check 3: gtag function exists
  if (!window.gtag) {
    diagnostics.issues.push('⚠️ window.gtag is not defined')
    diagnostics.recommendations.push('Google Analytics script may not have loaded yet')
    diagnostics.recommendations.push('Check browser console for script loading errors')
    diagnostics.recommendations.push('Verify the script tag is in the DOM')
    diagnostics.status = 'warning'
  } else {
    diagnostics.issues.push('✅ window.gtag is available')
  }

  // Check 4: dataLayer exists
  if (!window.dataLayer) {
    diagnostics.issues.push('⚠️ window.dataLayer is not defined')
    diagnostics.recommendations.push('DataLayer should be initialized before gtag')
    diagnostics.status = 'warning'
  } else {
    diagnostics.issues.push(`✅ window.dataLayer exists (${window.dataLayer.length} items)`)
  }

  // Check 5: Script tag in DOM
  if (GA_MEASUREMENT_ID) {
    const scriptTag = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    )
    
    if (!scriptTag) {
      diagnostics.issues.push('⚠️ Google Analytics script tag not found in DOM')
      diagnostics.recommendations.push('Script may not have loaded yet')
      diagnostics.recommendations.push('Check network tab for script loading errors')
      diagnostics.status = 'warning'
    } else {
      diagnostics.issues.push('✅ Google Analytics script tag found in DOM')
    }
  }

  // Check 6: Network connectivity
  if (navigator.onLine === false) {
    diagnostics.issues.push('⚠️ Network appears to be offline')
    diagnostics.recommendations.push('Check internet connection')
    diagnostics.status = 'warning'
  }

  // Check 7: Ad blockers (heuristic check)
  if (window.gtag && typeof window.gtag === 'function') {
    try {
      // Try to access gtag - if it throws, might be blocked
      window.gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId) => {
        if (!clientId) {
          diagnostics.issues.push('⚠️ Unable to get client ID - may be blocked')
          diagnostics.recommendations.push('Check if ad blocker is interfering')
        }
      })
    } catch (e) {
      diagnostics.issues.push('⚠️ Error accessing gtag - may be blocked by ad blocker')
      diagnostics.recommendations.push('Try disabling ad blockers to test')
    }
  }

  // Determine final status
  if (diagnostics.status === 'unknown') {
    if (GA_MEASUREMENT_ID && window.gtag && window.dataLayer) {
      diagnostics.status = 'success'
    } else {
      diagnostics.status = 'warning'
    }
  }

  return diagnostics
}

export const logDiagnostics = () => {
  const diag = diagnoseGoogleAnalytics()
  
  console.group('🔍 Google Analytics Diagnostics')
  console.log('Measurement ID:', diag.measurementId || 'Not set')
  console.log('Current URL:', diag.currentUrl)
  console.log('Current Path:', diag.currentPath)
  console.log('\nIssues:')
  diag.issues.forEach(issue => console.log('  ', issue))
  
  if (diag.recommendations.length > 0) {
    console.log('\nRecommendations:')
    diag.recommendations.forEach(rec => console.log('  ', rec))
  }
  
  console.log('\nStatus:', diag.status === 'success' ? '✅ Working' : 
                       diag.status === 'error' ? '❌ Error' : '⚠️ Warning')
  console.groupEnd()
  
  return diag
}

// Test tracking functions
export const testTracking = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  if (!GA_MEASUREMENT_ID) {
    console.error('Cannot test tracking: VITE_GA_MEASUREMENT_ID not set')
    return false
  }

  if (!window.gtag) {
    console.error('Cannot test tracking: window.gtag not available')
    return false
  }

  console.log('🧪 Testing Google Analytics tracking...')
  
  // Test page view
  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: '/test',
      page_title: 'Test Page',
    })
    console.log('✅ Page view tracking test sent')
  } catch (e) {
    console.error('❌ Page view tracking test failed:', e)
    return false
  }

  // Test event
  try {
    window.gtag('event', 'test_event', {
      event_category: 'diagnostics',
      event_label: 'test_tracking',
    })
    console.log('✅ Event tracking test sent')
  } catch (e) {
    console.error('❌ Event tracking test failed:', e)
    return false
  }

  console.log('✅ All tracking tests completed. Check Google Analytics Real-Time reports to verify.')
  return true
}
