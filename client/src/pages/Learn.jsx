import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { youtubeAPI } from '../services/api'
import SEO from '../components/SEO'
import { getCollectionPageSchema, getBreadcrumbSchema } from '../utils/structuredData'
import '../styles/pages/learn.css'

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@munenegeoffrey'

function Learn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: userLoading, user } = useUser()
  const [videos, setVideos] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect authenticated users to /user/learn for user-specific content
  useEffect(() => {
    if (!userLoading && isAuthenticated && location.pathname === '/learn') {
      navigate('/user/learn', { replace: true })
    }
  }, [isAuthenticated, userLoading, navigate, location.pathname])

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const videosResponse = await youtubeAPI.getVideos(YOUTUBE_CHANNEL_URL, 12)
      
      if (videosResponse.success && videosResponse.data.length > 0) {
        setVideos(videosResponse.data)
      } else {
        // If no videos from API, use channel URL for embedding
        setVideos([])
      }

      // Try to fetch playlists
      try {
        const playlistsResponse = await youtubeAPI.getPlaylists(YOUTUBE_CHANNEL_URL)
        if (playlistsResponse.success && playlistsResponse.data.length > 0) {
          setPlaylists(playlistsResponse.data)
        }
      } catch (err) {
        console.log('Playlists not available')
      }

      setError('')
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Unable to load videos. Please check back later.')
    } finally {
      setLoading(false)
    }
  }

  // Featured videos
  const featuredVideos = [
    {
      id: '4zb7_9H7s9o',
      title: 'How to create and verify Airtm Account in 2023!',
      description: 'Step-by-step guide to creating and verifying your Airtm account for remote work payments.',
      videoUrl: 'https://www.youtube.com/embed/4zb7_9H7s9o',
    },
    {
      id: '1A6uW4ji7_s',
      title: 'How to Apply For Whatcom | Search Engine Evaluator Appen Project + Language Assessment Exam in 2023!',
      description: 'Complete guide to applying for Whatcom and passing the Appen Search Engine Evaluator project.',
      videoUrl: 'https://www.youtube.com/embed/1A6uW4ji7_s',
    },
    {
      id: 'NS0hPHzl0gc',
      title: 'How To Create a Microsoft Live ID in 2023?',
      description: 'Learn how to create a Microsoft Live ID account for remote work platforms and applications.',
      videoUrl: 'https://www.youtube.com/embed/NS0hPHzl0gc',
    },
  ]

  // Featured playlists
  const featuredPlaylists = [
    {
      id: 'PLd_UwJyzlb33FpeVgneP2jnrqJH2KolA3',
      title: 'TOLOKA YANDEX QUALIFICATIONS',
      description: 'Complete guide to Toloka Yandex qualifications and how to pass them successfully.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb33FpeVgneP2jnrqJH2KolA3',
    },
    {
      id: 'PLd_UwJyzlb303hFiI5f83BskJVlDddxFg',
      title: 'How to create Accounts',
      description: 'Tutorials on creating accounts for various remote work platforms and services.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb303hFiI5f83BskJVlDddxFg',
    },
    {
      id: 'PLd_UwJyzlb31C2mGwjS4oLBxn7km2f3KP',
      title: 'UHRS QUALIFICATIONS ANSWERS',
      description: 'Answers and tips for UHRS (Universal Human Relevance System) qualification exams.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb31C2mGwjS4oLBxn7km2f3KP',
    },
  ]

  const quickTips = [
    {
      id: 1,
      tip: 'Create a dedicated workspace',
      description: 'Set up a professional environment that signals work mode.',
    },
    {
      id: 2,
      tip: 'Master asynchronous communication',
      description: 'Learn to communicate effectively across time zones.',
    },
    {
      id: 3,
      tip: 'Build your online presence',
      description: 'Establish a professional brand on LinkedIn and other platforms.',
    },
  ]

  const learnUrl = isAuthenticated ? "/user/learn" : "/learn"
  const learnTitle = isAuthenticated ? "My Courses - Learn Remote Work" : "Learn Remote Work"
  const learnDescription = isAuthenticated 
    ? "Access your enrolled courses, track progress, and discover new learning resources for remote work."
    : "Comprehensive tutorials, YouTube playlists, and resources to accelerate your remote work journey. Learn from video tutorials, guides, and expert tips."

  const collectionSchema = getCollectionPageSchema(
    learnUrl,
    learnTitle,
    learnDescription
  )
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://geoffreymunene.app/' },
    { name: 'Learn', url: `https://geoffreymunene.app${learnUrl}` },
  ])
  
  const structuredData = [collectionSchema, breadcrumbSchema]

  return (
    <>
      <SEO
        title={learnTitle}
        description={learnDescription}
        keywords="remote work tutorials, remote work courses, learn remote work, remote work training, work from home guide, remote work skills"
        url={learnUrl}
        structuredData={structuredData}
      />
      <div className="learn-page">
      <section className="learn-hero">
        <div className="learn-container">
          <h1 className="page-title">
            {isAuthenticated ? 'My Courses & Learning' : 'Learn Remote Work'}
          </h1>
          <p className="page-subtitle">
            {isAuthenticated 
              ? 'Access your enrolled courses, track your progress, and discover new learning resources'
              : 'Comprehensive tutorials and YouTube playlists to accelerate your remote work journey'}
          </p>
          {isAuthenticated && user?.subscriptions?.activeCourses?.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                📚 You're enrolled in {user.subscriptions.activeCourses.length} course{user.subscriptions.activeCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="learn-content">
        <div className="learn-wrapper">
          {/* YouTube Videos Section */}
          <div className="videos-section">
            <h2 className="section-title">Latest Videos</h2>
            {loading && (
              <div className="loading-state">
                <p>Loading videos...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && videos.length > 0 && (
              <div className="videos-grid">
                {videos.map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="video-thumbnail">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={video.thumbnail} alt={video.title} loading="lazy" decoding="async" />
                        <div className="play-overlay">
                          <span className="play-icon">▶</span>
                        </div>
                      </a>
                    </div>
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <p className="video-date">
                        {new Date(video.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div className="channel-embed">
                <p className="channel-description">
                  Check out my YouTube channel for the latest remote work tips and tutorials:
                </p>
                <div className="channel-link-container">
                  <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link-button"
                  >
                    Visit YouTube Channel →
                  </a>
                </div>
                <div className="channel-embed-container">
                  <iframe
                    src={`https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_URL.split('@')[1]}`}
                    title="YouTube Channel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="channel-iframe"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Featured Videos Section */}
          <div className="featured-videos-section">
            <h2 className="section-title">Featured Tutorials</h2>
            <div className="featured-videos-grid">
              {featuredVideos.map((video) => (
                <div key={video.id} className="featured-video-card">
                  <h3 className="featured-video-title">{video.title}</h3>
                  <p className="featured-video-description">{video.description}</p>
                  <div className="featured-video-embed">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="watch-on-youtube"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Playlists Section */}
          <div className="playlists-section">
            <h2 className="section-title">Video Playlists</h2>
            {playlists.length > 0 && (
              <div className="playlists-grid">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="playlist-card">
                    <div className="playlist-thumbnail">
                      <img src={playlist.thumbnail} alt={playlist.title} loading="lazy" decoding="async" />
                    </div>
                    <h3 className="playlist-title">{playlist.title}</h3>
                    <p className="playlist-description">{playlist.description}</p>
                    <p className="playlist-count">{playlist.videoCount} videos</p>
                    <a
                      href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="playlist-link"
                    >
                      Watch Playlist →
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Featured Playlists */}
            <div className="playlists-grid">
              {featuredPlaylists.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <h3 className="playlist-title">{playlist.title}</h3>
                  <p className="playlist-description">{playlist.description}</p>
                  <div className="playlist-video">
                    <iframe
                      src={playlist.playlistUrl}
                      title={playlist.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a
                    href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="playlist-link"
                  >
                    Watch Full Playlist →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="quick-tips-section">
            <h2 className="section-title">Quick Tips</h2>
            <div className="tips-grid">
              {quickTips.map((item) => (
                <div key={item.id} className="tip-card">
                  <h3 className="tip-title">{item.tip}</h3>
                  <p className="tip-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Learn
