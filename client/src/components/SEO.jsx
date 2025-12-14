import { Helmet } from 'react-helmet-async'

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://remowork.life/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  structuredData,
}) => {
  const siteUrl = 'https://remowork.life'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`
  const fullTitle = title
    ? `${title} | Remowork`
    : 'Remowork - Remote Work Coach & Content Creator'
  const fullDescription =
    description ||
    'Learn how to land your dream remote job. Get free tools, resources, and guidance to build a successful remote career. AI-powered resume builder, job listings, and video tutorials.'

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || 'Remowork'} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="Remowork" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@munenegeoffrey" />
      <meta name="twitter:site" content="@munenegeoffrey" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        Array.isArray(structuredData) ? (
          structuredData.map((data, index) => (
            data && (
              <script key={index} type="application/ld+json">
                {JSON.stringify(data)}
              </script>
            )
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )
      )}
    </Helmet>
  )
}

export default SEO

