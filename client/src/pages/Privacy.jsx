import SEO from '../components/SEO'
import '../styles/pages/privacy.css'

function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Geoffrey Munene collects, uses, and protects your personal information. Our commitment to your privacy and data security."
        keywords="privacy policy, data protection, privacy statement, user privacy, data security"
        url="/privacy"
      />
      <div className="privacy-page">
        <section className="privacy-hero">
          <div className="privacy-container">
            <h1 className="page-title">Privacy Policy</h1>
            <p className="page-subtitle">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </section>

        <section className="privacy-content">
          <div className="content-container">
            <div className="legal-content">
              <p className="intro-text">
                At Geoffrey Munene, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>

              <div className="privacy-section">
                <h2 className="section-title">1. Information We Collect</h2>
                
                <h3 className="subsection-title">1.1 Personal Information</h3>
                <p className="section-text">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="privacy-list">
                  <li>Register for an account or use our services</li>
                  <li>Subscribe to our newsletter or mailing list</li>
                  <li>Fill out a contact form or request information</li>
                  <li>Participate in surveys, contests, or promotions</li>
                  <li>Make a purchase or transaction</li>
                  <li>Communicate with us via email or other channels</li>
                </ul>
                <p className="section-text">
                  The personal information we may collect includes:
                </p>
                <ul className="privacy-list">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Professional information (job title, company name, resume/CV)</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h3 className="subsection-title">1.2 Automatically Collected Information</h3>
                <p className="section-text">
                  When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
                </p>
                <ul className="privacy-list">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Device identifiers</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">2. How We Use Your Information</h2>
                <p className="section-text">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="privacy-list">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process transactions and send related information</li>
                  <li>To send you newsletters, marketing communications, and promotional materials</li>
                  <li>To respond to your comments, questions, and requests</li>
                  <li>To provide customer support and assistance</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To personalize your experience and deliver content relevant to your interests</li>
                  <li>To comply with legal obligations and enforce our terms of service</li>
                  <li>To protect our rights, property, and safety, as well as that of our users</li>
                </ul>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">3. Information Sharing and Disclosure</h2>
                <p className="section-text">
                  We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
                </p>

                <h3 className="subsection-title">3.1 Service Providers</h3>
                <p className="section-text">
                  We may share your information with third-party service providers who perform services on our behalf, such as:
                </p>
                <ul className="privacy-list">
                  <li>Payment processing</li>
                  <li>Email delivery and marketing services</li>
                  <li>Website hosting and analytics</li>
                  <li>Customer support services</li>
                  <li>Data storage and backup services</li>
                </ul>
                <p className="section-text">
                  These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                </p>

                <h3 className="subsection-title">3.2 Legal Requirements</h3>
                <p className="section-text">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                </p>

                <h3 className="subsection-title">3.3 Business Transfers</h3>
                <p className="section-text">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>

                <h3 className="subsection-title">3.4 With Your Consent</h3>
                <p className="section-text">
                  We may share your information with third parties when you have given us explicit consent to do so.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">4. Cookies and Tracking Technologies</h2>
                <p className="section-text">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p className="section-text">
                  Types of cookies we use:
                </p>
                <ul className="privacy-list">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
                <p className="section-text">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">5. Data Security</h2>
                <p className="section-text">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="privacy-list">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Secure data storage and backup systems</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="section-text">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">6. Your Privacy Rights</h2>
                <p className="section-text">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="privacy-list">
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
                  <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
                </ul>
                <p className="section-text">
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">7. Data Retention</h2>
                <p className="section-text">
                  We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">8. Children's Privacy</h2>
                <p className="section-text">
                  Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">9. Third-Party Links</h2>
                <p className="section-text">
                  Our website may contain links to third-party websites, services, or applications that are not owned or controlled by us. This Privacy Policy does not apply to such third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">10. International Data Transfers</h2>
                <p className="section-text">
                  Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction. By using our website, you consent to the transfer of your information to these facilities.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">11. Changes to This Privacy Policy</h2>
                <p className="section-text">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              <div className="privacy-section">
                <h2 className="section-title">12. Contact Us</h2>
                <p className="section-text">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="contact-info">
                  Email: <a href="mailto:munenemuchokiofficial@gmail.com" className="contact-link">munenemuchokiofficial@gmail.com</a>
                </p>
                <p className="section-text">
                  We will respond to your inquiry within a reasonable timeframe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Privacy

