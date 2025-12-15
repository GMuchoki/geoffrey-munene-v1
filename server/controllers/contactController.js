import Contact from '../models/Contact.js'
import { validationResult } from 'express-validator'
import { sendSupportEmail } from '../utils/emailService.js'

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Format errors for better frontend handling
      const errorMessages = errors.array().map(err => err.msg)
      return res.status(400).json({
        success: false,
        message: errorMessages[0] || 'Validation failed',
        errors: errors.array(),
      })
    }

    const { name, email, subject, message } = req.body

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    })

    // Send email to support@remowork.life asynchronously (don't block response)
    const emailSubject = `Contact Form: ${subject}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">New Contact Form Submission</h2>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #4a5568;">${message}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
          <p>This message was sent from the contact form on ${process.env.FRONTEND_URL || 'https://remowork.life'}</p>
          <p>You can reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `
    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the contact form on ${process.env.FRONTEND_URL || 'https://remowork.life'}
You can reply directly to this email to respond to ${name}.
    `

    // Send email asynchronously (don't block the response)
    sendSupportEmail(
      'support@remowork.life',
      emailSubject,
      emailHtml,
      emailText,
      email // Set reply-to to the sender's email so support can reply directly
    )
      .then((result) => {
        if (result.success) {
          console.log('✅ Contact form email sent to support@remowork.life')
        } else {
          console.error('❌ Failed to send contact form email:', result.error)
        }
      })
      .catch((err) => {
        console.error('❌ Error sending contact form email:', err)
      })

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: contact,
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error.message,
    })
  }
}

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (should be protected in production)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: error.message,
    })
  }
}

// @desc    Get a single contact message
// @route   GET /api/contact/:id
// @access  Private (should be protected in production)
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: error.message,
    })
  }
}

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private (should be protected in production)
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
      error: error.message,
    })
  }
}

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private (should be protected in production)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
      error: error.message,
    })
  }
}

