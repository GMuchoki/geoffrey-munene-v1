import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { jobsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import '../styles/pages/job-detail.css'

function JobDetail() {
  const { id } = useParams()
  const { state } = useLocation()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state?.job && state.job.id === id) {
      setJob(state.job)
      setLoading(false)
    } else {
      fetchJob()
    }
  }, [id, state])

  const fetchJob = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await jobsAPI.getById(id)
      if (response.success) {
        setJob(response.data)
      } else {
        setError(response.message || 'Job not found')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details. Please try again later.')
      console.error('Error fetching job:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified'
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num)
    if (min && max) {
      return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`
    }
    if (min) return `${currency} ${formatNumber(min)}+`
    if (max) return `Up to ${currency} ${formatNumber(max)}`
    return 'Salary not specified'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderMarkdown = (text) => {
    if (!text) return null

    const escapeHtml = (str) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    const formatInline = (str) => {
      const escaped = escapeHtml(str)
      return escaped
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>') // italic
    }

    const lines = text.split('\n')
    const elements = []
    let listItems = []

    const flushList = (key) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="description-list">
            {listItems.map((item, idx) => (
              <li
                key={idx}
                dangerouslySetInnerHTML={{ __html: formatInline(item) }}
              />
            ))}
          </ul>
        )
        listItems = []
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (/^[-*]\s+/.test(trimmed)) {
        listItems.push(trimmed.replace(/^[-*]\s+/, ''))
      } else if (trimmed) {
        flushList(index)
        elements.push(
          <p
            key={`p-${index}`}
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        )
      } else {
        flushList(index)
      }
    })

    flushList(lines.length)
    return elements
  }

  if (loading) {
    return (
      <>
        <SEO title="Loading Job Details..." url={`/remote-jobs/${id}`} />
        <div className="job-detail-page">
          <div className="job-detail-container">
            <SkeletonLoader type="job-detail" count={1} />
          </div>
        </div>
      </>
    )
  }

  if (error || !job) {
    return (
      <>
        <SEO title="Job Not Found" url={`/remote-jobs/${id}`} />
        <div className="job-detail-page">
          <div className="job-detail-container">
            <div className="error-state">
              <h2>Job Not Found</h2>
              <p>{error || 'The job you are looking for does not exist or has been removed.'}</p>
              <div className="error-actions">
                <Link to="/remote-jobs" className="back-button">
                  ← Back to Remote Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${job.title} at ${job.company} - Remote Jobs`}
        description={job.description ? job.description.substring(0, 160) : `Remote job opportunity: ${job.title} at ${job.company}`}
        keywords={`${job.title}, ${job.company}, remote jobs, ${job.category}`}
        url={`/remote-jobs/${id}`}
      />
      <div className="job-detail-page">
        <div className="job-detail-container">
          {/* Header Section */}
          <div className="job-detail-header">
            <Link to="/remote-jobs" className="back-link">
              ← Back to Remote Jobs
            </Link>
            
            <div className="job-header-content">
              <div className="job-header-main">
                {job.companyLogo && (
                  <img 
                    src={job.companyLogo} 
                    alt={`${job.company} logo`}
                    className="job-detail-logo"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div className="job-header-info">
                  <h1 className="job-detail-title">{job.title}</h1>
                  <div className="job-detail-company">
                    <strong>{job.company}</strong>
                    {job.source === 'himalayas' && (
                      <span className="job-source-badge" title="Job listing from Himalayas">
                        🏔️
                      </span>
                    )}
                    {job.source === 'adzuna' && (
                      <span className="job-source-badge" title="Job listing from Adzuna">
                        🌐
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="job-header-meta">
                <span className="job-category-badge">{job.category}</span>
                <span className="job-type-badge">{job.contractType}</span>
              </div>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="job-detail-content">
            <div className="job-detail-main">
              {/* Key Information */}
              <div className="job-key-info">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-content">
                    <span className="info-label">Location</span>
                    <span className="info-value">{job.location}</span>
                  </div>
                </div>
                
                {(job.hourlyRate || job.salaryMin || job.salaryMax) && (
                  <div className="info-item">
                    <span className="info-icon">💰</span>
                    <div className="info-content">
                      <span className="info-label">{job.hourlyRate ? 'Hourly Rate' : 'Salary'}</span>
                      <span className="info-value">
                        {job.hourlyRate
                          ? job.hourlyRate
                          : formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div className="info-content">
                    <span className="info-label">Posted</span>
                    <span className="info-value">{formatDate(job.created)}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="job-description-section">
                <h2 className="section-title">Job Description</h2>
                <div className="job-description-content">
                  {job.description ? (
                    <div className="description-text">
                      {renderMarkdown(job.description)}
                    </div>
                  ) : (
                    <p className="no-description">No description available for this job.</p>
                  )}
                </div>
              </div>

              {/* Apply Section */}
              <div className="job-apply-section">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-button-primary"
                >
                  Apply Now →
                </a>
                <p className="apply-note">
                  You will be redirected to the company's website to complete your application.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="job-detail-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Job Summary</h3>
                <div className="sidebar-content">
                  <div className="summary-item">
                    <span className="summary-label">Company</span>
                    <span className="summary-value">{job.company}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Location</span>
                    <span className="summary-value">{job.location}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Type</span>
                    <span className="summary-value">{job.contractType}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Category</span>
                    <span className="summary-value">{job.category}</span>
                  </div>
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="summary-item">
                      <span className="summary-label">Salary</span>
                      <span className="summary-value">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-card">
                <h3 className="sidebar-title">Share This Job</h3>
                <div className="share-buttons">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Job link copied to clipboard!')
                    }}
                    className="share-button"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobDetail

