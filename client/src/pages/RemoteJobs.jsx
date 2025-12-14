import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import { getCollectionPageSchema, getBreadcrumbSchema } from '../utils/structuredData'
import '../styles/pages/remote-jobs.css'

function RemoteJobs() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 })

  useEffect(() => {
    fetchCategories()
    fetchJobs()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchJobs()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const fetchCategories = async () => {
    try {
      const response = await jobsAPI.getCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        search: searchTerm,
        category: selectedCategory,
        page: currentPage,
        results_per_page: 12,
      }

      const response = await jobsAPI.getJobs(params)
      console.log('Jobs API response:', response)
      
      if (response.success) {
        const jobsData = response.data || []
        setJobs(Array.isArray(jobsData) ? jobsData : [])
        setPagination(response.pagination || { current: 1, total: 1, count: 0 })
        setError('')
        
        // Log debug info to browser console
        if (response.debug) {
          console.log('🔍 Jobs API Debug Info:', response.debug)
          console.log('📊 Sources:', response.debug.sources)
          console.log('🔌 API Status:', response.debug.api)
          console.log('🔍 Filters:', response.debug.filters)
          console.log('📈 Totals:', {
            beforeFilter: response.debug.totalBeforeFilter,
            afterFilter: response.debug.totalAfterFilter,
          })
          
          // Show detailed warning if no API jobs found
          if (response.debug.sources.himalayas === 0 && response.debug.sources.adzuna === 0) {
            console.warn('⚠️ No jobs found from APIs!')
            console.log('📋 Manual jobs:', response.debug.sources.manual)
            console.log('🏔️ Himalayas:', {
              fetched: response.debug.api.himalayas.fetched,
              filtered: response.debug.api.himalayas.filtered,
              error: response.debug.api.himalayas.error,
              cacheUsed: response.debug.api.cache?.used && response.debug.api.cache?.source === 'himalayas'
            })
            console.log('🌐 Adzuna:', {
              fetched: response.debug.api.adzuna.fetched,
              filtered: response.debug.api.adzuna.filtered,
              error: response.debug.api.adzuna.error,
            })
            
            if (response.debug.api.himalayas.error) {
              console.error('❌ Himalayas API Error:', response.debug.api.himalayas.error)
            }
            if (response.debug.api.adzuna.error) {
              console.error('❌ Adzuna API Error:', response.debug.api.adzuna.error)
            }
            
            // Check if API was called at all
            if (response.debug.api.himalayas.fetched === 0 && !response.debug.api.himalayas.error) {
              console.warn('⚠️ Himalayas API may not have been called or returned 0 jobs')
            }
          } else {
            console.log('✅ API jobs found:', {
              himalayas: response.debug.sources.himalayas,
              adzuna: response.debug.sources.adzuna
            })
          }
        }
      } else {
        setError('Failed to load jobs')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load remote jobs. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
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
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const jobPlatforms = [
    {
      id: 1,
      name: 'Remote.co',
      description: 'Curated remote job listings across various industries and skill levels.',
      category: 'General',
      link: 'https://remote.co',
      icon: '🌐',
    },
    {
      id: 2,
      name: 'We Work Remotely',
      description: 'The largest remote work community with jobs in design, programming, and more.',
      category: 'Tech & Design',
      link: 'https://weworkremotely.com',
      icon: '💻',
    },
    {
      id: 3,
      name: 'FlexJobs',
      description: 'Hand-screened remote and flexible job opportunities with premium features.',
      category: 'Premium',
      link: 'https://flexjobs.com',
      icon: '⭐',
    },
    {
      id: 4,
      name: 'Remote OK',
      description: 'Remote jobs in programming, design, marketing, and customer support.',
      category: 'Tech',
      link: 'https://remoteok.io',
      icon: '🚀',
    },
    {
      id: 5,
      name: 'AngelList',
      description: 'Startup jobs including many remote opportunities in tech and business.',
      category: 'Startups',
      link: 'https://angel.co',
      icon: '👼',
    },
    {
      id: 6,
      name: 'Upwork',
      description: 'Freelance marketplace for remote projects and long-term contracts.',
      category: 'Freelance',
      link: 'https://upwork.com',
      icon: '🤝',
    },
  ]

  const collectionSchema = getCollectionPageSchema(
    '/remote-jobs',
    'Remote Jobs',
    'Find your dream remote job. Browse curated remote work opportunities across various industries. Search and filter by category, location, and job type.'
  )
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://remowork.life/' },
    { name: 'Remote Jobs', url: 'https://remowork.life/remote-jobs' },
  ])
  
  const structuredData = [collectionSchema, breadcrumbSchema]

  return (
    <>
      <SEO
        title="Remote Jobs"
        description="Find your dream remote job. Browse curated remote work opportunities across various industries. Search and filter by category, location, and job type."
        keywords="remote jobs, work from home jobs, remote work opportunities, online jobs, remote job board, telecommute jobs"
        url="/remote-jobs"
        structuredData={structuredData}
      />
      <div className="remote-jobs-page">
      <section className="remote-jobs-hero">
        <div className="remote-jobs-container">
          <h1 className="page-title">Remote Job Listings</h1>
          <p className="page-subtitle">
            Find your next remote work opportunity from thousands of listings
          </p>
        </div>
      </section>

      <section className="remote-jobs-content">
        <div className="remote-jobs-wrapper">
          {/* Search and Filter Section */}
          <div className="jobs-search-section">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for jobs (e.g., 'developer', 'designer', 'marketing')..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="category-filter"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            {pagination.count > 0 && (
              <p className="results-count">
                {pagination.count} remote jobs found
              </p>
            )}
          </div>

          {/* Jobs Listings */}
          <div className="jobs-listings-section">
            {loading && (
              <SkeletonLoader type="job-card" count={12} />
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <span className="job-category">{job.category}</span>
                      </div>
                      <div className="job-company">
                        {job.companyLogo && (
                          <img 
                            src={job.companyLogo} 
                            alt={`${job.company} logo`}
                            className="company-logo"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                        <strong>{job.company}</strong>
                        {job.source === 'himalayas' && (
                          <span className="job-source-badge" title="Job listing from Himalayas">
                            🏔️
                          </span>
                        )}
                      </div>
                      <div className="job-details">
                        <span className="job-location">📍 {job.location}</span>
                        <span className="job-type">{job.contractType}</span>
                      </div>
                      {(job.hourlyRate || job.salaryMin || job.salaryMax) && (
                        <div className="job-salary">
                          {job.hourlyRate
                            ? `💵 ${job.hourlyRate}`
                            : `💰 ${formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}`}
                        </div>
                      )}
                      {(job.excerpt || job.description) && (
                        <p className="job-description">
                          {job.excerpt
                            ? job.excerpt
                            : job.description.length > 150 
                              ? `${job.description.substring(0, 150)}...` 
                              : job.description}
                        </p>
                      )}
                      <div className="job-footer">
                        <span className="job-date">{formatDate(job.created)}</span>
                        <div className="job-actions">
                          <Link
                            to={`/remote-jobs/${job.id}`}
                            state={{ job }}
                            className="job-view-details-button"
                          >
                            View Details
                          </Link>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="job-apply-button"
                          >
                            Apply Now →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ← Previous
                    </button>
                    <span className="pagination-info">
                      Page {pagination.current} of {pagination.total}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.total, prev + 1))}
                      disabled={currentPage === pagination.total}
                      className="pagination-button"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="no-jobs">
                <p className="text-lg font-medium">No jobs found</p>
                <p className="text-sm mt-2 opacity-75">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Job Platforms Section */}
          <div className="platforms-section">
            <h2 className="section-title">Popular Remote Job Platforms</h2>
            <div className="platforms-grid">
              {jobPlatforms.map((platform) => (
                <div key={platform.id} className="platform-card">
                  <div className="platform-icon">{platform.icon}</div>
                  <div className="platform-category">{platform.category}</div>
                  <h3 className="platform-name">{platform.name}</h3>
                  <p className="platform-description">{platform.description}</p>
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-link"
                  >
                    Visit Platform →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="jobs-tips">
            <h2 className="section-title">Tips for Finding Remote Jobs</h2>
            <ul className="tips-list">
              <li>Set up job alerts on multiple platforms to never miss an opportunity</li>
              <li>Customize your resume and cover letter for each remote position</li>
              <li>Highlight your remote work experience and self-management skills</li>
              <li>Build a strong online presence on LinkedIn and professional networks</li>
              <li>Prepare for video interviews and remote work assessments</li>
            </ul>
          </div>

          {/* Attribution Section */}
          <div className="jobs-attribution">
            <p className="attribution-text">
              Job listings powered by{' '}
              <a 
                href="https://himalayas.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="attribution-link"
              >
                Himalayas
              </a>
              {' '}and other sources. Visit{' '}
              <a 
                href="https://himalayas.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="attribution-link"
              >
                Himalayas.app
              </a>
              {' '}for the latest remote job opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default RemoteJobs
