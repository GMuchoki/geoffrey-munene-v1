import dotenv from 'dotenv'
import { sendSupportEmail, sendEmail } from '../utils/emailService.js'

// Load environment variables
dotenv.config({ path: './.env' })

console.log('🧪 Testing Support Email (Reply-To Enabled)\n')
console.log('Environment Check:')
console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set')
console.log('  RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Not set (will use default)')
console.log('  RESEND_SUPPORT_EMAIL:', process.env.RESEND_SUPPORT_EMAIL || 'Not set (will use default)')
console.log('  EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'Not set (will use default)')
console.log('')

// Test email addresses
const testRecipient = process.argv[2] || 'test@example.com'
const supportEmail = process.env.RESEND_SUPPORT_EMAIL || 'support@remowork.life'

console.log('='.repeat(60))
console.log('Test 1: Sending Support Email (with reply-to)')
console.log('='.repeat(60))
console.log(`📧 To: ${testRecipient}`)
console.log(`📧 From: ${supportEmail}`)
console.log(`📧 Reply-To: ${supportEmail}`)
console.log('')

try {
  const result = await sendSupportEmail(
    testRecipient,
    '🧪 Test: Support Email with Reply-To',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Test Support Email</h2>
      <p>This is a test email sent from <strong>${supportEmail}</strong>.</p>
      <p><strong>Important:</strong> This email has reply-to enabled, so you can reply directly to it.</p>
      <p>If you reply to this email, it should be received at <strong>${supportEmail}</strong>.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is a test email to verify that email receiving is working correctly.
      </p>
    </div>
    `,
    `Test Support Email

This is a test email sent from ${supportEmail}.

Important: This email has reply-to enabled, so you can reply directly to it.

If you reply to this email, it should be received at ${supportEmail}.

This is a test email to verify that email receiving is working correctly.`
  )

  if (result.success) {
    console.log('✅ Support email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log('')
    console.log('📝 Next Steps:')
    console.log('   1. Check your email inbox:', testRecipient)
    console.log('   2. Try replying to the email')
    console.log('   3. Check Resend Dashboard → Emails for delivery status')
    console.log('   4. If you set up webhooks, check for inbound email events')
  } else {
    console.error('❌ Failed to send support email:')
    console.error('   Error:', result.error)
  }
} catch (error) {
  console.error('❌ Error sending support email:', error)
  console.error('   Error message:', error.message)
  console.error('   Error stack:', error.stack)
}

console.log('')
console.log('='.repeat(60))
console.log('Test 2: Sending System Email (no reply-to)')
console.log('='.repeat(60))
console.log(`📧 To: ${testRecipient}`)
console.log(`📧 From: ${process.env.RESEND_FROM_EMAIL || 'noreply@remowork.life'}`)
console.log(`📧 Reply-To: None (system notification)`)
console.log('')

try {
  const result = await sendEmail(
    testRecipient,
    '🧪 Test: System Email (No Reply-To)',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Test System Email</h2>
      <p>This is a test system notification email.</p>
      <p><strong>Note:</strong> This email does NOT have reply-to enabled.</p>
      <p>If you try to reply, it will not be received.</p>
    </div>
    `,
    `Test System Email

This is a test system notification email.

Note: This email does NOT have reply-to enabled.
If you try to reply, it will not be received.`
  )

  if (result.success) {
    console.log('✅ System email sent successfully!')
    console.log('   Message ID:', result.messageId)
  } else {
    console.error('❌ Failed to send system email:')
    console.error('   Error:', result.error)
  }
} catch (error) {
  console.error('❌ Error sending system email:', error)
  console.error('   Error message:', error.message)
}

console.log('')
console.log('='.repeat(60))
console.log('Test 3: Testing Reply-To Functionality')
console.log('='.repeat(60))
console.log('📧 Sending email that simulates a support response')
console.log('')

try {
  const result = await sendSupportEmail(
    testRecipient,
    'Re: Your Support Request - Test',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Re: Your Support Request</h2>
      <p>Thank you for contacting Remowork support!</p>
      <p>This is a test response email. When you reply to this email, your reply should be received at:</p>
      <p style="background: #f0f0f0; padding: 10px; border-left: 4px solid #4CAF50;">
        <strong>${supportEmail}</strong>
      </p>
      <p>To test receiving:</p>
      <ol>
        <li>Reply to this email from your email client</li>
        <li>Check Resend Dashboard → Emails → Inbound</li>
        <li>Or check your webhook endpoint (if configured)</li>
      </ol>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated test email. Please do not reply unless testing email receiving.
      </p>
    </div>
    `,
    `Re: Your Support Request

Thank you for contacting Remowork support!

This is a test response email. When you reply to this email, your reply should be received at: ${supportEmail}

To test receiving:
1. Reply to this email from your email client
2. Check Resend Dashboard → Emails → Inbound
3. Or check your webhook endpoint (if configured)

This is an automated test email. Please do not reply unless testing email receiving.`
  )

  if (result.success) {
    console.log('✅ Reply test email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log('')
    console.log('📝 To Test Email Receiving:')
    console.log('   1. Check your inbox:', testRecipient)
    console.log('   2. Reply to the email')
    console.log('   3. Check Resend Dashboard:')
    console.log('      - Go to https://resend.com/emails')
    console.log('      - Look for "Inbound" section')
    console.log('      - Or check webhook logs if configured')
    console.log('')
    console.log('💡 Tip: You can also send a test email TO support@remowork.life')
    console.log('   from any email client to test receiving directly.')
  } else {
    console.error('❌ Failed to send reply test email:')
    console.error('   Error:', result.error)
  }
} catch (error) {
  console.error('❌ Error sending reply test email:', error)
  console.error('   Error message:', error.message)
}

console.log('')
console.log('✅ All tests complete!')
console.log('')
console.log('📚 Documentation:')
console.log('   - See RESEND_EMAIL_ADDRESSES.md for setup details')
console.log('   - See Resend Dashboard for email delivery status')


