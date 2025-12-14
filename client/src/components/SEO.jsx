import { Helmet } from 'react-helmet-async'

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://remowork.life/og-image.jpg',
  url,
  type = 'website',
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
      <meta name="author" content="Remowork" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Remowork" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />
      <meta property="twitter:creator" content="@munenegeoffrey" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#2563eb" />
    </Helmet>
  )
}

export default SEO

