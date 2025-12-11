import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// Load environment variables
dotenv.config()

console.log('🧪 Testing Email Configuration...\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log('  GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Not set')
console.log('  GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set (' + process.env.GMAIL_APP_PASSWORD.length + ' chars)' : '❌ Not set')
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set')
console.log('  NODE_ENV:', process.env.NODE_ENV || 'Not set')
console.log('')

// Create transporter
let transporter

if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  console.log('📧 Using Gmail configuration...')
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS (not SSL)
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  })
} else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('📧 Using SMTP configuration...')
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
} else {
  console.error('❌ No email configuration found!')
  console.error('   Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file')
  process.exit(1)
}

// Test connection
console.log('🔌 Testing connection...')
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection failed!')
    console.error('   Error:', error.message)
    console.error('')
    console.error('💡 Common issues:')
    console.error('   1. Check your Gmail App Password is correct')
    console.error('   2. Make sure 2FA is enabled on your Gmail account')
    console.error('   3. Verify the app password has no spaces')
    console.error('   4. Check your internet connection')
    process.exit(1)
  } else {
    console.log('✅ Connection successful!')
    console.log('')
    
    // Send test email
    const testEmail = process.env.GMAIL_USER || process.env.SMTP_USER
    console.log('📤 Sending test email to:', testEmail)
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER,
      to: testEmail,
      subject: '🧪 Test Email - Email Service Working!',
      text: 'This is a test email from your application. If you receive this, your email service is configured correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ Email Service Test</h2>
          <p>This is a test email from your application.</p>
          <p>If you receive this, your email service is configured correctly!</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send email!')
        console.error('   Error:', error.message)
        console.error('')
        console.error('💡 Troubleshooting:')
        console.error('   1. Check your Gmail App Password')
        console.error('   2. Make sure "Less secure app access" is not needed (use App Password instead)')
        console.error('   3. Verify your email address is correct')
        process.exit(1)
      } else {
        console.log('✅ Test email sent successfully!')
        console.log('   Message ID:', info.messageId)
        console.log('')
        console.log('📬 Check your inbox:', testEmail)
        console.log('   (Also check spam folder if not in inbox)')
        console.log('')
        console.log('🎉 Email service is working correctly!')
        process.exit(0)
      }
    })
  }
})

