import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiHome } from 'react-icons/hi2'
import '../../styles/pages/admin-form.css'

function AdminJobForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    description: '',
    excerpt: '',
    hourlyRate: '',
    salary: '',
    contractType: 'Full-time',
    category: '',
    applyUrl: '',
    featured: false,
    active: true,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    if (isEdit) {
      fetchJob()
    }
  }, [id, isAuthenticated, navigate, isEdit])

  const fetchJob = async () => {
    try {
      const response = await adminAPI.getJobById(id)
      if (response.success) {
        setFormData(response.data)
      }
    } catch (error) {
      setError('Failed to fetch job')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isEdit
        ? await adminAPI.updateJob(id, formData)
        : await adminAPI.createJob(formData)

      if (response.success) {
        navigate('/admin/jobs')
      } else {
        setError(response.message || 'Failed to save job')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard" className="admin-breadcrumb-link">
            <HiHome /> Dashboard
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <Link to="/admin/jobs" className="admin-breadcrumb-link">
            Remote Jobs
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">
            {isEdit ? 'Edit Job' : 'New Job'}
          </span>
        </div>

        <div className="admin-form-header">
          <div className="admin-page-title-section">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="admin-back-dashboard-btn"
              title="Back to Dashboard"
            >
              ← Dashboard
            </button>
            <h1>{isEdit ? 'Edit Job' : 'Add New Job'}</h1>
          </div>
          <button onClick={() => navigate('/admin/jobs')} className="admin-back-btn">
            ← Back to Jobs
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., IT & Software, Marketing"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Contract Type *</label>
              <select name="contractType" value={formData.contractType} onChange={handleChange} required>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Hourly Pay (optional)</label>
              <input
                type="text"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="$30/hr or £25-£35/hr"
              />
            </div>
            <div className="admin-form-group">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group full-width">
              <label>Excerpt (shown in list)</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                placeholder="Short teaser that appears in the job list"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group full-width">
              <label>Apply URL *</label>
              <input
                type="url"
                name="applyUrl"
                value={formData.applyUrl}
                onChange={handleChange}
                required
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate('/admin/jobs')} className="admin-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminJobForm

