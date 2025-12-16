import { useState } from 'react'
import { contactAPI } from '../services/api'
import SEO from '../components/SEO'
import { getBreadcrumbSchema } from '../utils/structuredData'
import { trackEvent } from '../components/GoogleAnalytics'
import toast from 'react-hot-toast'
import { 
  HiEnvelope,
  HiPhone,
  HiClock,
  HiMapPin
} from 'react-icons/hi2'
import { 
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'
import '../styles/pages/contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactAPI.sendMessage(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent successfully! I will get back to you soon.')
      
      // Track successful form submission
      trackEvent('form_submit', 'contact', formData.subject, 1)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
      
      // Track form submission error
      trackEvent('form_error', 'contact', formData.subject, 0)
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://geoffreymunene.app/' },
    { name: 'Contact', url: 'https://geoffreymunene.app/contact' },
  ])

  return (
    <>
      <SEO
        title="Contact Geoffrey Munene"
        description="Get in touch with Geoffrey Munene. Have questions about remote work, need career advice, or want to collaborate? Reach out through the contact form."
        keywords="contact Geoffrey Munene, remote work consultation, career coaching contact"
        url="/contact"
        structuredData={[breadcrumbSchema]}
      />
      <div className="contact-page">
      {/* Blue Banner Section */}
      <section className="contact-hero">
        <div className="contact-hero-container">
          <h1 className="contact-hero-title">Contact Me</h1>
          <p className="contact-hero-subtitle">
            Have questions or want to work together? Get in touch!
          </p>
        </div>
      </section>

      {/* Main Content - Two Columns */}
      <section className="contact-content">
        <div className="contact-wrapper">
          <div className="contact-grid">
            {/* Left Column - Get In Touch */}
            <div className="contact-info-column">
              <h2 className="section-title">Get In Touch</h2>
              <p className="info-intro">
                I'm always open to discussing remote work coaching, content creation opportunities, 
                speaking engagements, or answering your questions about working remotely.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper">
                    <div className="detail-icon-circle">
                      <HiEnvelope className="detail-icon-svg" />
                    </div>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-label">Email</h3>
                    <a href="mailto:munenemuchokiofficial@gmail.com" className="detail-value">
                      munenemuchokiofficial@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper">
                    <div className="detail-icon-circle">
                      <HiPhone className="detail-icon-svg" />
                    </div>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-label">Phone</h3>
                    <a href="tel:+254700127598" className="detail-value">
                      +254700127598
                    </a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper">
                    <div className="detail-icon-circle">
                      <HiClock className="detail-icon-svg" />
                    </div>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-label">Business Hours</h3>
                    <p className="detail-value">Mon-Fri: 9AM - 5PM EST</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper">
                    <div className="detail-icon-circle">
                      <HiMapPin className="detail-icon-svg" />
                    </div>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-label">Location</h3>
                    <p className="detail-value">Remote (Worldwide)</p>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3 className="social-title">Connect on Social Media</h3>
                <p className="social-description">
                  Follow me for regular remote work tips, job opportunities, and resource updates.
                </p>
                <div className="social-icons">
                  <a href="https://x.com/munene_muchoki" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="https://www.linkedin.com/in/munenemuchoki" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                  <a href="https://youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="YouTube">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Send a Message Form */}
            <div className="contact-form-column">
              <h2 className="section-title">Send a Message</h2>
              <div className="form-wrapper">
                <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="coaching">Remote Work Coaching</option>
                    <option value="collaboration">Content Collaboration</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="question">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="6"
                    required
                  ></textarea>
                </div>

                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="form-success">
                    Thank you for your message! I will get back to you soon.
                  </div>
                )}

                <button 
                  type="submit" 
                  className="form-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Contact

