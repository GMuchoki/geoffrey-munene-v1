/**
 * Structured Data (JSON-LD) utilities for SEO
 * Generates schema.org structured data for better search engine understanding
 */

const siteUrl = 'https://geoffreymunene.app'
const siteName = 'Geoffrey Munene'
const siteDescription = 'Learn how to land your dream remote job. Get free tools, resources, and guidance to build a successful remote career.'

/**
 * Generate Organization structured data
 */
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/og-image.jpg`,
    description: siteDescription,
    sameAs: [
      'https://x.com/munene_muchoki',
      'https://www.linkedin.com/in/munenemuchoki',
      'https://youtube.com/@munenegeoffrey',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'munenemuchokiofficial@gmail.com',
      contactType: 'Customer Service',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
    },
    founder: {
      '@type': 'Person',
      name: 'Geoffrey Munene',
      url: `${siteUrl}/about`,
    },
  }
}

/**
 * Generate Website structured data
 */
export const getWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Article structured data for blog posts
 */
export const getArticleSchema = (article) => {
  if (!article) return null

  const articleUrl = `${siteUrl}/blog/${article._id}`
  const imageUrl = article.thumbnail || `${siteUrl}/og-image.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.description,
    image: imageUrl,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: 'Geoffrey Munene',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'Remote Work',
    keywords: article.category || 'remote work, remote jobs, work from home',
    url: articleUrl,
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export const getBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Person structured data (for About page)
 */
export const getPersonSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Geoffrey Munene',
    url: `${siteUrl}/about`,
    jobTitle: 'Remote Work Coach & Content Creator',
    description: 'Helping people land remote jobs, build digital careers, and achieve work-life balance through practical guidance, tools, and resources.',
    sameAs: [
      'https://x.com/munene_muchoki',
      'https://www.linkedin.com/in/munenemuchoki',
      'https://youtube.com/@munenegeoffrey',
    ],
    email: 'munenemuchokiofficial@gmail.com',
    image: `${siteUrl}/og-image.jpg`,
  }
}

/**
 * Generate BlogPosting structured data (alternative to Article)
 */
export const getBlogPostingSchema = (article) => {
  if (!article) return null

  const articleUrl = `${siteUrl}/blog/${article._id}`
  const imageUrl = article.thumbnail || `${siteUrl}/og-image.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || article.description,
    image: imageUrl,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: 'Geoffrey Munene',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'Remote Work',
    keywords: article.category || 'remote work, remote jobs, work from home',
    url: articleUrl,
  }
}

/**
 * Generate CollectionPage structured data (for blog listing)
 */
export const getCollectionPageSchema = (url, name, description) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    url: `${siteUrl}${url}`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  }
}

/**
 * Generate ContactPage structured data
 */
export const getContactPageSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Geoffrey Munene',
    description: 'Get in touch with Geoffrey Munene for remote work coaching, career advice, or collaboration opportunities.',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'Person',
      name: 'Geoffrey Munene',
      email: 'munenemuchokiofficial@gmail.com',
      telephone: '+254700127598',
      jobTitle: 'Remote Work Coach & Content Creator',
      sameAs: [
        'https://x.com/munene_muchoki',
        'https://www.linkedin.com/in/munenemuchoki',
        'https://youtube.com/@munenegeoffrey',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  }
}

/**
 * Generate JobPosting structured data
 */
export const getJobPostingSchema = (job) => {
  if (!job) return null

  const jobUrl = `${siteUrl}/remote-jobs/${job.id || job._id}`
  const baseSalary = job.minSalary || job.maxSalary
    ? {
        '@type': 'MonetaryAmount',
        currency: job.currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.minSalary,
          maxValue: job.maxSalary,
          unitText: job.currency || 'USD',
        },
      }
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.summary || '',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Job ID',
      value: job.id || job._id,
    },
    datePosted: job.createdAt || job.postedDate || new Date().toISOString(),
    validThrough: job.expiresAt || job.closingDate,
    employmentType: job.employmentType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.companyUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location || 'Remote',
        addressLocality: job.location || 'Remote',
      },
    },
    baseSalary: baseSalary,
    workHours: job.workHours,
    skills: job.skills || [],
    qualifications: job.requirements || job.qualifications,
    responsibilities: job.responsibilities,
    url: jobUrl,
    applicationContact: {
      '@type': 'ContactPoint',
      email: job.applicationEmail,
      url: job.applicationUrl || jobUrl,
    },
  }
}
