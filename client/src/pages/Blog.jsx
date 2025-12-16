import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import { getCollectionPageSchema, getBreadcrumbSchema } from '../utils/structuredData'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import '../styles/pages/blog.css'

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogPosts, setBlogPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState([])
  const postsPerPage = 6

  useEffect(() => {
    fetchBlogs()
    
    // Check URL parameters for filtering
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    
    if (searchParam) {
      setSearchTerm(searchParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (allPosts.length > 0) {
      filterPosts()
    }
  }, [searchTerm, selectedCategory, allPosts])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await blogsAPI.getAll()
      console.log('Blogs API response:', response)
      
      // Handle different response formats
      const posts = response?.data || response || []
      
      if (!Array.isArray(posts)) {
        console.error('Invalid response format:', response)
        setError('Invalid response from server')
        return
      }
      
      setAllPosts(posts)
      setBlogPosts(posts)
      
      // Extract unique categories from blog posts
      const uniqueCategories = [...new Set(posts.map(post => post.category).filter(Boolean))]
      // Sort categories alphabetically
      const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b))
      setCategories(sortedCategories)
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load blog posts. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = [...allPosts]

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setBlogPosts(filtered)
    setCurrentPage(1)
  }

  // Get count of posts per category
  const getCategoryCount = (category) => {
    return allPosts.filter(post => 
      post.category && post.category.toLowerCase() === category.toLowerCase()
    ).length
  }

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const collectionSchema = getCollectionPageSchema(
    '/blog',
    'Remote Work Blog',
    'Expert tips, guides, and insights on remote work, job searching, productivity, and building a successful remote career.'
  )
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://geoffreymunene.app/' },
    { name: 'Blog', url: 'https://geoffreymunene.app/blog' },
  ])
  
  const structuredData = [collectionSchema, breadcrumbSchema]

  return (
    <>
      <SEO
        title="Remote Work Blog"
        description="Expert tips, guides, and insights on remote work, job searching, productivity, and building a successful remote career. Learn from real experiences and proven strategies."
        keywords="remote work blog, remote work tips, work from home advice, remote job search, digital nomad blog, remote career advice"
        url="/blog"
        structuredData={structuredData}
      />
      <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-container">
          <h1 className="page-title">Remote Work Blog</h1>
          <p className="page-subtitle">
            Tips, strategies, and insights for your remote career journey
          </p>
        </div>
      </section>

      <section className="blog-content">
        <div className="blog-wrapper">
          {/* Search and Filter Section */}
          <div className="blog-filters">
            <div className="search-container">
              <div className="search-box">
                <HiMagnifyingGlass className="search-icon" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="category-buttons">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-dropdown"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => {
                    const count = getCategoryCount(category)
                    return (
                      <option key={category} value={category}>
                        {category} ({count})
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            {!loading && !error && blogPosts.length > 0 && (
              <div className="results-count">
                Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, blogPosts.length)} of {blogPosts.length} posts
              </div>
            )}
          </div>

          {loading && (
            <SkeletonLoader type="blog-card" count={6} />
          )}
          
          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {currentPosts.length === 0 ? (
                <p className="no-posts">No blog posts found. Try adjusting your search or filters.</p>
              ) : (
                <div className="blog-posts-grid">
                  {currentPosts.map((post) => (
                    <article key={post._id} className="blog-post-card">
                      {post.thumbnail && (
                        <div className="post-thumbnail">
                          <img src={post.thumbnail} alt={post.title} loading="lazy" />
                        </div>
                      )}
                      <div className="post-content">
                        <div className="post-header">
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="post-category">{post.category}</span>
                        </div>
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <Link to={`/blog/${post._id}`} className="post-read-more">
                          Read more &gt;
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    &lt; Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      )
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="pagination-ellipsis">...</span>
                    }
                    return null
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
    </>
  )
}

export default Blog

