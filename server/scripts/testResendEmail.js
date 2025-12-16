import dotenv from 'dotenv'
import { Resend } from 'resend'
import { sendVerificationCode } from '../utils/emailService.js'

// Load environment variables
dotenv.config({ path: './.env' })

console.log('🧪 Testing Resend Email Service\n')
console.log('Environment Check:')
console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set')
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set (will use default)')
console.log('  EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'Not set (will use default)')
console.log('  RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Not set (will use default)')
console.log('')

// Test email (replace with your email)
const testEmail = process.argv[2] || 'test@example.com'
const testCode = '123456'

console.log(`📧 Testing email to: ${testEmail}`)
console.log(`🔢 Test verification code: ${testCode}\n`)

// Test Resend directly
if (process.env.RESEND_API_KEY) {
  console.log('Testing Resend API directly...')
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.EMAIL_FROM_NAME || 'Geoffrey Munene'
    
    console.log(`  From: ${fromName} <${fromEmail}>`)
    console.log(`  To: ${testEmail}`)
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [testEmail],
      subject: '🧪 Test Email from Resend',
      html: `<h1>Test Email</h1><p>This is a test email. Your verification code is: <strong>${testCode}</strong></p>`,
      text: `Test Email\n\nThis is a test email. Your verification code is: ${testCode}`,
    })

    if (error) {
      console.error('❌ Resend API Error:', error)
      console.error('  Error details:', JSON.stringify(error, null, 2))
    } else {
      console.log('✅ Email sent successfully!')
      console.log('  Message ID:', data?.id)
    }
  } catch (error) {
    console.error('❌ Error testing Resend:', error)
    console.error('  Error message:', error.message)
    console.error('  Error stack:', error.stack)
  }
} else {
  console.log('⚠️  RESEND_API_KEY not set. Skipping direct Resend test.')
}

console.log('\n' + '='.repeat(50) + '\n')

// Test using the emailService function
console.log('Testing sendVerificationCode function...')
try {
  const result = await sendVerificationCode(testEmail, testCode)
  if (result.success) {
    console.log('✅ Verification email sent successfully!')
    console.log('  Message ID:', result.messageId)
  } else {
    console.error('❌ Failed to send verification email:')
    console.error('  Error:', result.error)
  }
} catch (error) {
  console.error('❌ Error in sendVerificationCode:', error)
  console.error('  Error message:', error.message)
  console.error('  Error stack:', error.stack)
}

console.log('\n✅ Test complete!')

