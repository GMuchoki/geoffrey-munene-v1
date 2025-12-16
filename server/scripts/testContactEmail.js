import dotenv from 'dotenv'
import { sendSupportEmail } from '../utils/emailService.js'

// Load environment variables
dotenv.config({ path: './.env' })

async function testContactEmail() {
  console.log('🧪 Testing Contact Form Email to support@geoffreymunene.app\n')

  // Check required environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in .env file')
    process.exit(1)
  }

  const supportEmail = process.env.RESEND_SUPPORT_EMAIL || 'support@geoffreymunene.app'
  console.log(`📧 Sending test contact form email to: ${supportEmail}\n`)

  // Simulate a contact form submission
  const testContact = {
    name: 'Test User',
    email: 'testuser@example.com',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message from the contact form. If you receive this, the contact form email functionality is working correctly!',
  }

  const emailSubject = `Contact Form: ${testContact.subject}`
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">New Contact Form Submission</h2>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${testContact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${testContact.email}">${testContact.email}</a></p>
        <p><strong>Subject:</strong> ${testContact.subject}</p>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Message:</h3>
        <p style="white-space: pre-wrap; color: #4a5568;">${testContact.message}</p>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
        <p>This message was sent from the contact form on ${process.env.FRONTEND_URL || 'https://geoffreymunene.app'}</p>
        <p>You can reply directly to this email to respond to ${testContact.name}.</p>
      </div>
    </div>
  `
  const emailText = `
New Contact Form Submission

Name: ${testContact.name}
Email: ${testContact.email}
Subject: ${testContact.subject}

Message:
${testContact.message}

---
This message was sent from the contact form on ${process.env.FRONTEND_URL || 'https://geoffreymunene.app'}
You can reply directly to this email to respond to ${testContact.name}.
  `

  try {
    const result = await sendSupportEmail(
      supportEmail,
      emailSubject,
      emailHtml,
      emailText,
      testContact.email // Reply-to address
    )

    if (result.success) {
      console.log('✅ Contact form email sent successfully!')
      console.log(`   Message ID: ${result.messageId || 'N/A'}`)
      console.log(`   From: ${supportEmail}`)
      console.log(`   To: ${supportEmail}`)
      console.log(`   Reply-To: ${testContact.email}`)
      console.log(`   Subject: ${emailSubject}`)
      console.log('\n📬 Check your inbox at support@geoffreymunene.app')
      console.log('   You should be able to reply directly to the sender.')
    } else {
      console.error('❌ Failed to send contact form email')
      console.error('   Error:', result.error)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error sending contact form email:')
    console.error('   ', error.message)
    if (error.response?.body) {
      console.error('   Resend API Error:', JSON.stringify(error.response.body, null, 2))
    }
    process.exit(1)
  }
}

testContactEmail()

