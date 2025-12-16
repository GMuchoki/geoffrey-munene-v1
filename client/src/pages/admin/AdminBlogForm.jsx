import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiHome } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-form.css'

function AdminBlogForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    thumbnail: '',
    videoUrl: '',
    author: 'Geoffrey Munene',
    published: true,
    featured: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    if (isEdit) {
      fetchBlog()
    }
  }, [id, isAuthenticated, navigate, isEdit])

  const fetchBlog = async () => {
    try {
      const response = await adminAPI.getBlogById(id)
      if (response.success) {
        setFormData(response.data)
      }
    } catch (error) {
      setError('Failed to fetch blog post')
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
        ? await adminAPI.updateBlog(id, formData)
        : await adminAPI.createBlog(formData)

      if (response.success) {
        toast.success(isEdit ? 'Blog post updated successfully!' : 'Blog post created successfully!')
        navigate('/admin/blogs')
      } else {
        const errorMsg = response.message || 'Failed to save blog post'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save blog post'
      setError(errorMsg)
      toast.error(errorMsg)
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
          <Link to="/admin/blogs" className="admin-breadcrumb-link">
            Blog Posts
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">
            {isEdit ? 'Edit Post' : 'New Post'}
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
            <h1>{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
          </div>
          <button onClick={() => navigate('/admin/blogs')} className="admin-back-btn">
            ← Back to Blogs
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="15"
                required
                placeholder="You can use markdown formatting here"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Video URL</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />
                Published
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
            <button type="button" onClick={() => navigate('/admin/blogs')} className="admin-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBlogForm

