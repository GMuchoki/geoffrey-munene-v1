import SEO from '../components/SEO'
import '../styles/pages/about.css'

function About() {
  return (
    <>
      <SEO
        title="About Remowork"
        description="Learn about Remowork, a platform dedicated to helping people navigate the world of remote work and build successful digital careers."
        keywords="about Remowork, remote work coach, content creator, digital nomad coach, remote work expert"
        url="/about"
      />
      <div className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">Content Creator & Remote Work Coach</p>
        </div>
      </section>

      <section className="about-content">
        <div className="content-container">
          <div className="about-text">
            <h2 className="content-title">My Mission</h2>
            <p className="content-paragraph">
              Remowork is a platform dedicated to helping people 
              navigate the world of remote work. Our mission is to empower individuals to land remote jobs, 
              work online, and build successful digital careers.
            </p>
            <p className="content-paragraph">
              Through my content, tutorials, and resources, I share practical strategies, proven tips, 
              and real-world insights that make remote work accessible to everyone. Whether you're just 
              starting your remote work journey or looking to advance your digital career, I'm here to help.
            </p>
            <p className="content-paragraph">
              I believe that remote work is the future, and everyone deserves the opportunity to work 
              from anywhere, build a fulfilling career, and achieve work-life balance.
            </p>
          </div>

          <div className="expertise-section">
            <h2 className="content-title">What I Help With</h2>
            <div className="expertise-grid">
              <div className="expertise-item">
                <h3>Remote Job Search</h3>
                <p>Finding the right remote opportunities that match your skills and goals</p>
              </div>
              <div className="expertise-item">
                <h3>Career Development</h3>
                <p>Building skills and strategies to grow in the digital economy</p>
              </div>
              <div className="expertise-item">
                <h3>Application Process</h3>
                <p>Crafting resumes, cover letters, and applications that get noticed</p>
              </div>
              <div className="expertise-item">
                <h3>Remote Work Skills</h3>
                <p>Developing the communication and productivity skills needed for remote success</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default About

