import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogsAPI } from '../services/api'
import SEO from '../components/SEO'
import { getArticleSchema, getBreadcrumbSchema } from '../utils/structuredData'
import '../styles/pages/blog-detail.css'

function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogsAPI.getById(id)
      setBlog(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load blog post. Please try again later.')
      console.error('Error fetching blog:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-state">
          <p>Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <>
        <SEO title="Blog Post Not Found" url={`/blog/${id}`} />
        <div className="blog-detail-page">
          <div className="error-state">
            <p>{error || 'Blog post not found'}</p>
            <Link to="/blog" className="back-link">← Back to Blog</Link>
          </div>
        </div>
      </>
    )
  }

  // Generate structured data for article
  const articleSchema = getArticleSchema(blog)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://remowork.life/' },
    { name: 'Blog', url: 'https://remowork.life/blog' },
    { name: blog.title, url: `https://remowork.life/blog/${id}` },
  ])
  
  const structuredData = [articleSchema, breadcrumbSchema].filter(Boolean)

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt}
        keywords={blog.category}
        image={blog.thumbnail || undefined}
        url={`/blog/${id}`}
        type="article"
        publishedTime={blog.createdAt}
        modifiedTime={blog.updatedAt || blog.createdAt}
        author="Geoffrey Munene"
        structuredData={structuredData}
      />
      <div className="blog-detail-page">
      {blog.thumbnail && (
        <div className="detail-hero">
          <div className="detail-thumbnail">
            <img src={blog.thumbnail} alt={blog.title} loading="lazy" decoding="async" />
          </div>
        </div>
      )}

      <article className="blog-detail">
        <div className="detail-content">
          <div className="detail-header">
            <span className="detail-category">{blog.category}</span>
            <span className="detail-date">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="detail-title">{blog.title}</h1>
          <p className="detail-excerpt">{blog.excerpt}</p>

          {blog.videoUrl && (
            <div className="detail-video">
              <iframe
                src={blog.videoUrl}
                title={blog.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="detail-body">
            {(() => {
              const lines = blog.content.split('\n')
              const elements = []
              let currentList = []
              let listType = null

              const flushList = () => {
                if (currentList.length > 0) {
                  if (listType === 'checkbox') {
                    elements.push(
                      <ul key={`list-${elements.length}`} className="content-list checkbox-list">
                        {currentList.map((item, idx) => (
                          <li key={idx} className="content-li checkbox-item">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              readOnly
                              className="checkbox-input"
                            />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  } else {
                    const ListTag = listType === 'ordered' ? 'ol' : 'ul'
                    elements.push(
                      <ListTag key={`list-${elements.length}`} className="content-list">
                        {currentList.map((item, idx) => (
                          <li key={idx} className="content-li">
                            {item}
                          </li>
                        ))}
                      </ListTag>
                    )
                  }
                  currentList = []
                  listType = null
                }
              }

              lines.forEach((line, index) => {
                const trimmed = line.trim()

                // Handle markdown-style headers
                if (trimmed.startsWith('# ')) {
                  flushList()
                  elements.push(
                    <h2 key={index} className="content-h2">
                      {trimmed.replace('# ', '')}
                    </h2>
                  )
                  return
                }
                if (trimmed.startsWith('## ')) {
                  flushList()
                  elements.push(
                    <h3 key={index} className="content-h3">
                      {trimmed.replace('## ', '')}
                    </h3>
                  )
                  return
                }
                if (trimmed.startsWith('### ')) {
                  flushList()
                  elements.push(
                    <h4 key={index} className="content-h4">
                      {trimmed.replace('### ', '')}
                    </h4>
                  )
                  return
                }

                // Handle bullet points
                if (trimmed.startsWith('- ')) {
                  if (listType !== 'unordered') {
                    flushList()
                    listType = 'unordered'
                  }
                  currentList.push(trimmed.replace('- ', ''))
                  return
                }

                // Handle numbered lists
                if (/^\d+\.\s/.test(trimmed)) {
                  if (listType !== 'ordered') {
                    flushList()
                    listType = 'ordered'
                  }
                  currentList.push(trimmed.replace(/^\d+\.\s/, ''))
                  return
                }

                // Handle checkboxes
                if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
                  if (listType !== 'checkbox') {
                    flushList()
                    listType = 'checkbox'
                  }
                  currentList.push({
                    text: trimmed.replace(/- \[[x ]\]\s/, ''),
                    checked: trimmed.includes('[x]'),
                  })
                  return
                }

                // Regular paragraphs
                if (trimmed) {
                  flushList()
                  elements.push(
                    <p key={index} className="content-paragraph">
                      {trimmed}
                    </p>
                  )
                } else {
                  // Empty line - flush list if exists
                  flushList()
                }
              })

              flushList() // Flush any remaining list
              return elements
            })()}
          </div>

          <div className="detail-footer">
            <Link to="/blog" className="back-link">← Back to Blog</Link>
          </div>
        </div>
      </article>
    </div>
    </>
  )
}

export default BlogDetail

