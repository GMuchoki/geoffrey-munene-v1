import axios from 'axios'
import Job from '../models/Job.js'
import { getCachedJobs, isCacheFresh, cacheJobs } from '../utils/jobCache.js'

// Allowed job keywords - jobs must contain at least one of these
// Keywords are matched flexibly (partial matches allowed)
const ALLOWED_JOB_KEYWORDS = [
  // Core terms
  'ai trainer',
  'data annotator',
  'ai tutor',
  'data labeler',
  'data annotation',
  
  // Variations
  'ai training',
  'data labeling',
  'data labelling',
  'annotation',
  'labeling',
  'labelling',
  'labeler',
  'labeller',
  'annotator',
  'machine learning trainer',
  'ml trainer',
  'data entry',
  'data processing',
  
  // AI/ML related
  'ai',
  'artificial intelligence',
  'machine learning',
  'ml',
  'deep learning',
  'neural network',
  'nlp',
  'natural language processing',
  'computer vision',
  'data science',
  
  // Data related
  'data',
  'dataset',
  'data set',
  'data collection',
  'data quality',
  'data validation',
  'data cleaning',
  'data preparation',
  'data curation',
  'data management',
  
  // Training/Teaching related
  'trainer',
  'training',
  'tutor',
  'tutoring',
  'instructor',
  'teaching',
  'educator',
  'education',
  
  // Content moderation/quality
  'content moderation',
  'content reviewer',
  'quality assurance',
  'qa',
  'quality control',
  'reviewer',
  'moderator',
  
  // Remote work friendly terms
  'remote',
  'work from home',
  'wfh',
  'freelance',
  'contract',
  'part-time',
  'flexible',
  
  // Add more keywords here as needed
]

// Set to true to disable keyword filtering (for testing)
const DISABLE_KEYWORD_FILTER = false

/**
 * Check if a job matches our allowed keywords
 * @param {string} title - Job title
 * @param {string} description - Job description
 * @param {string} category - Job category
 * @returns {boolean} True if job matches allowed keywords
 */
const matchesAllowedKeywords = (title = '', description = '', category = '') => {
  // If filter is disabled, allow all jobs
  if (DISABLE_KEYWORD_FILTER || ALLOWED_JOB_KEYWORDS.length === 0) {
    return true
  }
  const searchText = `${title} ${description} ${category}`.toLowerCase()
  return ALLOWED_JOB_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()))
}

/**
 * Helper function to fetch jobs from Himalayas API
 * @param {string} search - Search term (optional, will be combined with allowed keywords)
 * @param {number} page - Page number
 * @param {number} resultsPerPage - Results per page
 * @returns {Promise<Array>} Filtered jobs
 */
const fetchHimalayasJobs = async (search = '', page = 1, resultsPerPage = 20) => {
  try {
    const limit = Math.min(resultsPerPage, 20) // Himalayas API max is 20 per request
    const offset = (page - 1) * limit

    // Himalayas API endpoint
    const apiUrl = 'https://himalayas.app/jobs/api'
    const params = {
      limit,
      offset,
    }

    console.log(`🔍 Fetching from Himalayas API (page ${page}, limit ${limit})`)
    const response = await axios.get(apiUrl, { params, timeout: 10000 })

    // Himalayas API returns an object with a 'jobs' array, not a direct array
    const jobsArray = response.data?.jobs || response.data
    
    if (!jobsArray || !Array.isArray(jobsArray)) {
      console.log('⚠️ Himalayas API: No jobs array found in response')
      console.log('Response structure:', typeof response.data, response.data ? Object.keys(response.data) : 'null')
      return []
    }

    console.log(`📥 Himalayas API: Received ${jobsArray.length} jobs (total available: ${response.data?.totalCount || 'unknown'})`)

    // Transform and filter Himalayas jobs
    // First, let's see what we got before filtering
    const allReceivedJobs = jobsArray.length
    const sampleTitles = jobsArray.slice(0, 3).map(j => j.title || 'No title').join(', ')
    console.log(`📋 Sample job titles received: ${sampleTitles}`)
    
    const filteredJobs = jobsArray
      .filter((job) => {
        // First check if it matches our allowed keywords
        const matchesKeywords = matchesAllowedKeywords(
          job.title,
          job.description || job.excerpt,
          job.category
        )

        // Also check search term if provided
        if (search) {
          const searchLower = search.toLowerCase()
          const matchesSearch = (
            job.title?.toLowerCase().includes(searchLower) ||
            job.companyName?.toLowerCase().includes(searchLower) ||
            job.description?.toLowerCase().includes(searchLower) ||
            job.category?.toLowerCase().includes(searchLower)
          )
          return matchesKeywords && matchesSearch
        }

        return matchesKeywords
      })
    
    // Log sample of jobs that didn't match for debugging
    if (filteredJobs.length === 0 && allReceivedJobs > 0) {
      const nonMatchingTitles = jobsArray
        .filter(job => !matchesAllowedKeywords(job.title, job.description || job.excerpt, job.category))
        .slice(0, 5)
        .map(j => j.title || 'No title')
        .join(', ')
      console.log(`⚠️ No jobs matched keywords. Sample non-matching titles: ${nonMatchingTitles}`)
      console.log(`🔑 Looking for keywords: ${ALLOWED_JOB_KEYWORDS.join(', ')}`)
    }
    
    // Map filtered jobs to our format
    const mappedJobs = filteredJobs.map((job) => {
        // Strip HTML tags from description if present
        const stripHtml = (html) => {
          if (!html) return ''
          return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
        }
        
        const description = stripHtml(job.description || job.excerpt || '')
        
        return {
          id: `himalayas-${job.guid || job.title?.replace(/\s+/g, '-').toLowerCase()}`,
          title: job.title || 'Job Title Not Available',
          company: job.companyName || 'Company Not Specified',
          location: job.locationRestrictions || 'Remote',
          description: description,
          salaryMin: null, // Himalayas API doesn't provide salary in this endpoint
          salaryMax: null,
          salaryCurrency: 'USD',
          created: job.pubDate || new Date().toISOString(),
          url: job.applicationLink || '#',
          category: job.category || 'General',
          contractType: job.employmentType || 'Full-time',
          source: 'himalayas',
          companyLogo: job.companyLogo || null,
        }
      })

    console.log(`✅ Himalayas API: Filtered to ${mappedJobs.length} matching jobs`)
    return mappedJobs
  } catch (error) {
    console.error('❌ Error fetching Himalayas jobs:', error.message)
    return []
  }
}

/**
 * Helper function to fetch jobs from Adzuna API
 * @param {string} search - Search term
 * @param {string} location - Location code
 * @param {number} page - Page number
 * @param {number} resultsPerPage - Results per page
 * @param {string} sortBy - Sort order
 * @param {string} category - Category filter
 * @returns {Promise<Array>} Filtered jobs
 */
const fetchAdzunaJobs = async (search = '', location = 'us', page = 1, resultsPerPage = 12, sortBy = 'date', category = '') => {
  try {
    const apiKey = process.env.ADZUNA_API_KEY
    const appId = process.env.ADZUNA_APP_ID

    if (!apiKey || !appId) {
      console.log('⚠️ Adzuna API: Not configured (missing API keys)')
      return []
    }

    // Combine search with allowed keywords
    const searchTerms = ALLOWED_JOB_KEYWORDS.join(' OR ')
    const combinedSearch = search ? `${search} (${searchTerms})` : searchTerms

    console.log(`🔍 Fetching from Adzuna API (page ${page}, location: ${location})`)
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${location}/search/${page}`,
      {
        params: {
          app_id: appId,
          app_key: apiKey,
          results_per_page: parseInt(resultsPerPage),
          what: combinedSearch,
          sort_by: sortBy,
          ...(category && { category }),
        },
        timeout: 10000,
      }
    )

    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
      console.log('⚠️ Adzuna API: No results returned')
      return []
    }

    console.log(`📥 Adzuna API: Received ${response.data.results.length} jobs`)

    // Filter jobs to match our allowed keywords
    const filteredJobs = response.data.results
      .filter((job) => {
        return matchesAllowedKeywords(
          job.title,
          job.description || '',
          job.category?.label || ''
        )
      })
      .map((job) => ({
        id: `adzuna-${job.id}`,
        title: job.title,
        company: job.company?.display_name || 'Company not specified',
        location: job.location?.display_name || 'Remote',
        description: job.description || '',
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_is_predicted ? 'USD' : (job.salary_currency || 'USD'),
        created: job.created,
        url: job.redirect_url,
        category: job.category?.label || 'General',
        contractType: job.contract_type || 'Full-time',
        source: 'adzuna',
      }))

    console.log(`✅ Adzuna API: Filtered to ${filteredJobs.length} matching jobs`)
    return filteredJobs
  } catch (error) {
    console.error('❌ Error fetching Adzuna jobs:', error.message)
    return []
  }
}

// @desc    Get remote jobs from Himalayas API, Adzuna API, and manual jobs
// @route   GET /api/jobs
// @access  Public
export const getRemoteJobs = async (req, res) => {
  try {
    const { 
      search = '', 
      page = 1, 
      results_per_page = 12,
      category = '',
      source = 'all' // 'all', 'himalayas', 'adzuna', 'manual'
    } = req.query
    
    // Adzuna-specific params (only used if Adzuna is configured)
    const location = req.query.location || 'us'
    const sort_by = req.query.sort_by || 'date'

    // Get manual jobs from database
    let manualJobs = []
    if (source === 'all' || source === 'manual') {
      try {
        const manualJobsData = await Job.find({ active: true, source: 'manual' }).sort({ createdAt: -1 })
        manualJobs = manualJobsData.map((job) => ({
          id: job._id.toString(),
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          excerpt: job.excerpt || '',
          hourlyRate: job.hourlyRate || '',
          salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
          salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
          salaryCurrency: 'USD',
          created: job.createdAt.toISOString(),
          url: job.applyUrl,
          category: job.category,
          contractType: job.contractType,
          source: 'manual',
        }))
      } catch (error) {
        console.error('Error fetching manual jobs:', error)
      }
    }

    // Fetch jobs from multiple sources in parallel
    const jobsPromises = []

    // Fetch from Himalayas (always try this as it's free and doesn't require API key)
    if (source === 'all' || source === 'himalayas') {
      console.log(`🔍 Checking Himalayas API (source: ${source}, search: "${search}", category: "${category}")`)
      // Check cache first (only if no search/category filter)
      if (!search && !category) {
          try {
            const cacheFresh = await isCacheFresh('himalayas')
            console.log(`📦 Cache check: fresh=${cacheFresh}`)
            if (cacheFresh) {
              console.log('📦 Using cached Himalayas jobs')
              const cachedJobs = await getCachedJobs('himalayas')
              console.log(`📦 Found ${cachedJobs.length} cached jobs`)
              
              if (cachedJobs.length > 0) {
                const formattedCachedJobs = cachedJobs.map((job) => ({
              id: job.externalId || job._id.toString(),
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
              salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
              salaryCurrency: 'USD',
              created: job.pubDate?.toISOString() || job.createdAt.toISOString(),
              url: job.applyUrl,
              category: job.category,
              contractType: job.contractType,
              source: 'himalayas',
              companyLogo: job.companyLogo || null,
            }))
                jobsPromises.push(Promise.resolve({ 
                  source: 'himalayas', 
                  jobs: formattedCachedJobs,
                  fromCache: true,
                  rawCount: cachedJobs.length
                }))
              } else {
                // Cache says fresh but no jobs found, fetch from API
                console.log('⚠️ Cache says fresh but no jobs found, fetching from API')
                jobsPromises.push(
                  fetchHimalayasJobs(search, 1, 20)
                    .then(async (jobs) => {
                      console.log(`✅ Himalayas API: Fetched ${jobs.length} jobs`)
                      // Cache the jobs in background (don't wait)
                      cacheJobs(jobs, 'himalayas').catch(err => 
                        console.error('Error caching Himalayas jobs:', err)
                      )
                      return { 
                        source: 'himalayas', 
                        jobs: jobs || [],
                        fromCache: false,
                        rawCount: jobs?.length || 0
                      }
                    })
                    .catch(err => {
                      console.error('❌ Himalayas fetch error:', err.message)
                      return { 
                        source: 'himalayas', 
                        jobs: [],
                        error: err.message,
                        fromCache: false
                      }
                    })
                )
              }
            } else {
              // Cache expired or doesn't exist, fetch from API
              console.log('🔄 Cache expired or empty, fetching from Himalayas API')
              jobsPromises.push(
                fetchHimalayasJobs(search, 1, 20)
                  .then(async (jobs) => {
                    console.log(`✅ Himalayas API: Fetched ${jobs.length} jobs`)
                    // Cache the jobs in background (don't wait)
                    cacheJobs(jobs, 'himalayas').catch(err => 
                      console.error('Error caching Himalayas jobs:', err)
                    )
                    return { 
                      source: 'himalayas', 
                      jobs: jobs || [],
                      fromCache: false,
                      rawCount: jobs?.length || 0
                    }
                  })
                  .catch(err => {
                    console.error('❌ Himalayas fetch error:', err.message)
                    // Try to use stale cache if API fails
                    return getCachedJobs('himalayas').then(cachedJobs => {
                      console.log('📦 Using stale cache due to API error')
                      const formattedCachedJobs = cachedJobs.map((job) => ({
                        id: job.externalId || job._id.toString(),
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        description: job.description,
                        salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
                        salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
                        salaryCurrency: 'USD',
                        created: job.pubDate?.toISOString() || job.createdAt.toISOString(),
                        url: job.applyUrl,
                        category: job.category,
                        contractType: job.contractType,
                        source: 'himalayas',
                        companyLogo: job.companyLogo || null,
                      }))
                      return { source: 'himalayas', jobs: formattedCachedJobs }
                    }).catch(() => ({ source: 'himalayas', jobs: [] }))
                  })
              )
            }
          } catch (cacheError) {
            console.error('❌ Error checking cache:', cacheError)
            // If cache check fails, fetch from API
            console.log('🔄 Cache check failed, fetching from Himalayas API')
            jobsPromises.push(
              fetchHimalayasJobs(search, 1, 20)
                .then(async (jobs) => {
                  console.log(`✅ Himalayas API: Fetched ${jobs.length} jobs`)
                  cacheJobs(jobs, 'himalayas').catch(err => 
                    console.error('Error caching Himalayas jobs:', err)
                  )
                  return { 
                    source: 'himalayas', 
                    jobs: jobs || [],
                    fromCache: false,
                    rawCount: jobs?.length || 0
                  }
                })
                .catch(err => {
                  console.error('❌ Himalayas fetch error:', err.message)
                  return { 
                    source: 'himalayas', 
                    jobs: [],
                    error: err.message,
                    fromCache: false
                  }
                })
            )
          }
      } else {
        // Has search or category filter, fetch fresh from API
        console.log('🔍 Has search/category filter, fetching fresh from Himalayas API')
        jobsPromises.push(
          fetchHimalayasJobs(search, 1, 20)
            .then(jobs => {
              console.log(`✅ Himalayas API: Fetched ${jobs.length} jobs (with filter)`)
              return { 
                source: 'himalayas', 
                jobs,
                fromCache: false,
                rawCount: jobs.length
              }
            })
            .catch(err => {
              console.error('❌ Himalayas fetch error:', err.message)
              return { 
                source: 'himalayas', 
                jobs: [],
                error: err.message,
                fromCache: false
              }
            })
        )
      }
    }

    // Fetch from Adzuna ONLY if explicitly requested (not by default)
    let adzunaJobs = []
    if (source === 'adzuna') { // Only fetch Adzuna if explicitly requested, not by default
      // Check cache first (only if no search/category filter)
      if (!search && !category) {
        const cacheFresh = await isCacheFresh('adzuna')
        if (cacheFresh) {
          console.log('📦 Using cached Adzuna jobs')
          const cachedJobs = await getCachedJobs('adzuna')
          const formattedCachedJobs = cachedJobs.map((job) => ({
            id: job.externalId || job._id.toString(),
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
            salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
            salaryCurrency: 'USD',
            created: job.pubDate?.toISOString() || job.createdAt.toISOString(),
            url: job.applyUrl,
            category: job.category,
            contractType: job.contractType,
            source: 'adzuna',
            companyLogo: job.companyLogo || null,
          }))
          jobsPromises.push(Promise.resolve({ source: 'adzuna', jobs: formattedCachedJobs }))
        } else {
          // Cache expired or doesn't exist, fetch from API
          console.log('🔄 Cache expired, fetching from Adzuna API')
          jobsPromises.push(
            fetchAdzunaJobs(search, location, parseInt(page), parseInt(results_per_page), sort_by, category)
              .then(async (jobs) => {
                console.log(`✅ Adzuna API: Fetched ${jobs.length} jobs`)
                // Cache the jobs in background (don't wait)
                cacheJobs(jobs, 'adzuna').catch(err => 
                  console.error('Error caching Adzuna jobs:', err)
                )
                return { source: 'adzuna', jobs }
              })
              .catch(err => {
                console.error('❌ Adzuna fetch error:', err.message)
                // Try to use stale cache if API fails
                return getCachedJobs('adzuna').then(cachedJobs => {
                  console.log('📦 Using stale cache due to API error')
                  const formattedCachedJobs = cachedJobs.map((job) => ({
                    id: job.externalId || job._id.toString(),
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    description: job.description,
                    salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
                    salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
                    salaryCurrency: 'USD',
                    created: job.pubDate?.toISOString() || job.createdAt.toISOString(),
                    url: job.applyUrl,
                    category: job.category,
                    contractType: job.contractType,
                    source: 'adzuna',
                    companyLogo: job.companyLogo || null,
                  }))
                  return { source: 'adzuna', jobs: formattedCachedJobs }
                }).catch(() => ({ source: 'adzuna', jobs: [] }))
              })
          )
        }
      } else {
        // Has search or category filter, fetch fresh from API
        jobsPromises.push(
          fetchAdzunaJobs(search, location, parseInt(page), parseInt(results_per_page), sort_by, category)
            .then(jobs => {
              console.log(`✅ Adzuna API: Fetched ${jobs.length} jobs (with filter)`)
              return { source: 'adzuna', jobs }
            })
            .catch(err => {
              console.error('❌ Adzuna fetch error:', err.message)
              return { source: 'adzuna', jobs: [] }
            })
        )
      }
    }

    // Wait for all API calls to complete
    const results = await Promise.all(jobsPromises)
    
    // Extract jobs from results and collect debug info
    let himalayasJobs = []
    let debugInfo = {
      himalayas: { fetched: 0, filtered: 0, error: null, called: false },
      adzuna: { fetched: 0, filtered: 0, error: null, called: false },
      cache: { used: false, source: null }
    }
    
    console.log(`📦 Processing ${results.length} API results`)
    console.log(`📋 Results sources:`, results.map(r => r.source))
    
    results.forEach((result) => {
      if (result.source === 'himalayas') {
        himalayasJobs = result.jobs || []
        debugInfo.himalayas.called = true
        debugInfo.himalayas.fetched = result.rawCount || result.jobs?.length || 0
        debugInfo.himalayas.filtered = himalayasJobs.length
        if (result.fromCache) {
          debugInfo.cache.used = true
          debugInfo.cache.source = 'himalayas'
        }
        if (result.error) {
          debugInfo.himalayas.error = result.error
        }
        console.log(`✅ Himalayas result: ${himalayasJobs.length} jobs (fetched: ${debugInfo.himalayas.fetched}, fromCache: ${result.fromCache || false})`)
      } else if (result.source === 'adzuna') {
        adzunaJobs = result.jobs || []
        debugInfo.adzuna.called = true
        debugInfo.adzuna.fetched = result.rawCount || result.jobs?.length || 0
        debugInfo.adzuna.filtered = adzunaJobs.length
        if (result.fromCache) {
          debugInfo.cache.used = true
          debugInfo.cache.source = 'adzuna'
        }
        if (result.error) {
          debugInfo.adzuna.error = result.error
        }
        console.log(`✅ Adzuna result: ${adzunaJobs.length} jobs (fetched: ${debugInfo.adzuna.fetched})`)
      }
    })
    
    // Log if APIs weren't called
    if (!debugInfo.himalayas.called && (source === 'all' || source === 'himalayas')) {
      console.warn(`⚠️ Himalayas API was not called! Source: ${source}, jobsPromises length: ${jobsPromises.length}`)
      debugInfo.himalayas.error = 'API was not called - check source parameter and cache logic'
    }
    if (!debugInfo.adzuna.called && source === 'adzuna') {
      console.warn('⚠️ Adzuna API was not called! Check source parameter.')
      debugInfo.adzuna.error = 'API was not called - check source parameter'
    }

    // Combine all jobs (manual first, then Himalayas, then Adzuna)
    let allJobs = [...manualJobs, ...himalayasJobs, ...adzunaJobs]

    // Filter by category if provided
    if (category && category !== '') {
      const categoryLower = category.toLowerCase()
      
      // Category mapping for flexible matching
      const categoryMappings = {
        'it': ['it', 'software', 'technology', 'tech', 'information technology'],
        'software': ['software', 'development', 'programming', 'developer', 'engineering'],
        'design': ['design', 'ui', 'ux', 'graphic'],
        'marketing': ['marketing', 'digital marketing', 'social media'],
        'sales': ['sales', 'business development'],
        'customer-service': ['customer', 'support', 'customer service', 'client'],
        'writing': ['writing', 'content', 'copywriting', 'editor'],
        'content': ['content', 'writing', 'copywriting', 'editor'],
        'accounting': ['accounting', 'finance', 'bookkeeping'],
        'finance': ['finance', 'accounting', 'financial'],
        'hr': ['hr', 'human resources', 'recruiting', 'recruitment', 'talent'],
        'project-management': ['project', 'management', 'pm', 'project manager'],
        'data': ['data', 'analytics', 'analysis', 'data science'],
        'product': ['product', 'product management', 'pm'],
        'engineering': ['engineering', 'developer', 'programming', 'software'],
        'developer': ['developer', 'programming', 'software', 'engineering', 'coder'],
        'programming': ['programming', 'developer', 'software', 'coding', 'coder'],
      }
      
      const searchTerms = categoryMappings[categoryLower] || [categoryLower]
      
      allJobs = allJobs.filter((job) => {
        const jobCategory = (job.category || '').toLowerCase()
        if (!jobCategory) return false
        
        // Check if any of the search terms match the job category
        return searchTerms.some(term => jobCategory.includes(term))
      })
    }

    // Sort by date (newest first)
    allJobs.sort((a, b) => {
      const dateA = new Date(a.created)
      const dateB = new Date(b.created)
      return dateB - dateA
    })

    // Calculate pagination
    const totalJobs = allJobs.length
    const totalPages = Math.ceil(totalJobs / parseInt(results_per_page))
    const startIndex = (parseInt(page) - 1) * parseInt(results_per_page)
    const endIndex = startIndex + parseInt(results_per_page)
    const paginatedJobs = allJobs.slice(startIndex, endIndex)

    // If no jobs found from any source, use sample jobs as fallback
    if (paginatedJobs.length === 0 && manualJobs.length === 0) {
      const sampleJobs = getSampleJobs()
      return res.status(200).json({
        success: true,
        data: sampleJobs,
        message: 'No jobs found. Showing sample jobs. Configure APIs for real listings.',
        pagination: {
          current: 1,
          total: 1,
          count: sampleJobs.length,
        },
      })
    }

    res.status(200).json({
      success: true,
      data: paginatedJobs,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        count: totalJobs,
      },
      debug: {
        sources: {
          manual: manualJobs.length,
          himalayas: himalayasJobs.length,
          adzuna: adzunaJobs.length,
        },
        api: debugInfo,
        filters: {
          search: search || 'none',
          category: category || 'none',
          allowedKeywords: ALLOWED_JOB_KEYWORDS,
        },
        totalBeforeFilter: manualJobs.length + (debugInfo.himalayas.fetched || 0) + (debugInfo.adzuna.fetched || 0),
        totalAfterFilter: allJobs.length,
      },
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    })
  }
}

// Sample jobs for when API is not configured
const getSampleJobs = () => {
  return [
    {
      id: 1,
      title: 'Remote Software Developer',
      company: 'Tech Solutions Inc.',
      location: 'Remote (US)',
      description: 'We are looking for an experienced software developer to join our remote team...',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      created: new Date().toISOString(),
      url: 'https://example.com/job/1',
      category: 'IT & Software',
      contractType: 'Full-time',
    },
    {
      id: 2,
      title: 'Remote Customer Support Specialist',
      company: 'Customer First Co.',
      location: 'Remote (Global)',
      description: 'Join our customer support team and help customers from around the world...',
      salaryMin: 35000,
      salaryMax: 45000,
      salaryCurrency: 'USD',
      created: new Date().toISOString(),
      url: 'https://example.com/job/2',
      category: 'Customer Service',
      contractType: 'Full-time',
    },
  ]
}

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params

    // First, try to find manual job in database
    try {
      const manualJob = await Job.findOne({ 
        $or: [
          { _id: id },
          { externalId: id }
        ],
        active: true 
      })

      if (manualJob) {
        return res.status(200).json({
          success: true,
          data: {
            id: manualJob._id.toString(),
            title: manualJob.title,
            company: manualJob.company,
            location: manualJob.location,
            description: manualJob.description,
            salaryMin: manualJob.salary ? parseInt(manualJob.salary.match(/\d+/)?.[0]) : null,
            salaryMax: manualJob.salary ? parseInt(manualJob.salary.match(/\d+/g)?.[1] || manualJob.salary.match(/\d+/)?.[0]) : null,
            salaryCurrency: 'USD',
            created: manualJob.createdAt.toISOString(),
            url: manualJob.applyUrl,
            category: manualJob.category,
            contractType: manualJob.contractType,
            source: manualJob.source || 'manual',
            companyLogo: manualJob.companyLogo || null,
          },
        })
      }
    } catch (dbError) {
      // If it's not a valid MongoDB ID, continue to check external sources
      console.log('Not a database job, checking external sources...')
    }

    // Try cached external jobs first (faster than refetching)
    try {
      const cachedHimalayas = await getCachedJobs('himalayas')
      const cachedAdzuna = await getCachedJobs('adzuna')

      const cacheHit =
        cachedHimalayas.find(
          (job) => job.externalId === id || job._id?.toString() === id
        ) ||
        cachedAdzuna.find(
          (job) => job.externalId === id || job._id?.toString() === id
        )

      if (cacheHit) {
        return res.status(200).json({
          success: true,
          data: {
            id: cacheHit.externalId || cacheHit._id?.toString(),
            title: cacheHit.title,
            company: cacheHit.company,
            location: cacheHit.location,
            description: cacheHit.description,
            salaryMin: cacheHit.salary ? parseInt(cacheHit.salary.match(/\d+/)?.[0]) : null,
            salaryMax: cacheHit.salary ? parseInt(cacheHit.salary.match(/\d+/g)?.[1] || cacheHit.salary.match(/\d+/)?.[0]) : null,
            salaryCurrency: 'USD',
            created: cacheHit.pubDate?.toISOString() || cacheHit.createdAt?.toISOString(),
            url: cacheHit.applyUrl,
            category: cacheHit.category,
            contractType: cacheHit.contractType,
            source: cacheHit.source,
            companyLogo: cacheHit.companyLogo || null,
          },
        })
      }
    } catch (cacheErr) {
      console.log('Cache lookup failed, falling back to API fetch:', cacheErr.message)
    }

    // Check if it's an external job ID (himalayas-xxx or adzuna-xxx)
    if (id.startsWith('himalayas-')) {
      // For Himalayas jobs, we need to fetch from the API
      // Since we don't have a direct way to fetch a single job by ID from Himalayas,
      // we'll fetch a batch and find the matching one
      const himalayasJobs = await fetchHimalayasJobs('', 1, 50)
      const job = himalayasJobs.find(j => j.id === id)
      
      if (job) {
        return res.status(200).json({
          success: true,
          data: job,
        })
      }
    } else if (id.startsWith('adzuna-')) {
      // For Adzuna jobs, similar approach
      const adzunaJobs = await fetchAdzunaJobs('', 'us', 1, 50)
      const job = adzunaJobs.find(j => j.id === id)
      
      if (job) {
        return res.status(200).json({
          success: true,
          data: job,
        })
      }
    }

    // Job not found
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    })
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    })
  }
}

// @desc    Get job categories
// @route   GET /api/jobs/categories
// @access  Public
export const getJobCategories = async (req, res) => {
  try {
    const categories = [
      { value: '', label: 'All Categories' },
      { value: 'it', label: 'IT & Software' },
      { value: 'software', label: 'Software Development' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'customer-service', label: 'Customer Service' },
      { value: 'writing', label: 'Writing & Content' },
      { value: 'content', label: 'Content Creation' },
      { value: 'accounting', label: 'Accounting & Finance' },
      { value: 'finance', label: 'Finance' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'project-management', label: 'Project Management' },
      { value: 'data', label: 'Data & Analytics' },
      { value: 'product', label: 'Product Management' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'developer', label: 'Developer' },
      { value: 'programming', label: 'Programming' },
    ]

    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    })
  }
}

