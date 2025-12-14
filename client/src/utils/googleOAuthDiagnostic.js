/**
 * Google OAuth Diagnostic Utility
 * Use this to debug Google OAuth issues
 */

export const diagnoseGoogleOAuth = () => {
  const diagnostics = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    currentOrigin: window.location.origin,
    currentUrl: window.location.href,
    userAgent: navigator.userAgent,
    issues: [],
    recommendations: [],
  }

  // Check 1: Client ID exists
  if (!diagnostics.clientId) {
    diagnostics.issues.push('❌ VITE_GOOGLE_CLIENT_ID is not set in environment variables')
    diagnostics.recommendations.push('Add VITE_GOOGLE_CLIENT_ID to client/.env file')
  } else {
    diagnostics.issues.push(`✅ Client ID is set: ${diagnostics.clientId.substring(0, 20)}...`)
  }

  // Check 2: Origin matches common patterns
  const allowedPatterns = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://geoffreymunene.netlify.app',
  ]
  
  const originMatches = allowedPatterns.some(pattern => 
    diagnostics.currentOrigin === pattern
  )

  if (!originMatches) {
    diagnostics.issues.push(`⚠️ Current origin (${diagnostics.currentOrigin}) may not be in Google Cloud Console`)
    diagnostics.recommendations.push(`Add ${diagnostics.currentOrigin} to Authorized JavaScript origins in Google Cloud Console`)
  } else {
    diagnostics.issues.push(`✅ Origin matches expected pattern: ${diagnostics.currentOrigin}`)
  }

  // Check 3: Client ID format
  if (diagnostics.clientId && !diagnostics.clientId.includes('.apps.googleusercontent.com')) {
    diagnostics.issues.push('❌ Client ID format looks incorrect')
    diagnostics.recommendations.push('Verify the Client ID is correct (should end with .apps.googleusercontent.com)')
  }

  return diagnostics
}

export const logDiagnostics = () => {
  const diag = diagnoseGoogleOAuth()
  console.group('🔍 Google OAuth Diagnostics')
  console.log('Client ID:', diag.clientId || 'NOT SET')
  console.log('Current Origin:', diag.currentOrigin)
  console.log('Current URL:', diag.currentUrl)
  console.log('\nIssues:')
  diag.issues.forEach(issue => console.log(issue))
  if (diag.recommendations.length > 0) {
    console.log('\nRecommendations:')
    diag.recommendations.forEach(rec => console.log(rec))
  }
  console.groupEnd()
  return diag
}

