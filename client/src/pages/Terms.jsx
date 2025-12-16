import SEO from '../components/SEO'
import '../styles/pages/terms.css'

function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Read the Terms & Conditions for using Geoffrey Munene's website, including user responsibilities, content usage, and service limitations."
        keywords="terms and conditions, terms of service, user agreement, website terms"
        url="/terms"
      />
      <div className="terms-page">
        <section className="terms-hero">
          <div className="terms-container">
            <h1 className="page-title">Terms & Conditions</h1>
            <p className="page-subtitle">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </section>

        <section className="terms-content">
          <div className="content-container">
            <div className="legal-content">
              <p className="intro-text">
                Welcome to Geoffrey Munene's website. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <div className="terms-section">
                <h2 className="section-title">1. Acceptance of Terms</h2>
                <p className="section-text">
                  By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">2. Use License</h2>
                <p className="section-text">
                  Permission is granted to temporarily download one copy of the materials on Geoffrey Munene's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="terms-list">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
                <p className="section-text">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by Geoffrey Munene at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">3. Disclaimer</h2>
                <p className="section-text">
                  The materials on Geoffrey Munene's website are provided on an 'as is' basis. Geoffrey Munene makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p className="section-text">
                  Further, Geoffrey Munene does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">4. Limitations</h2>
                <p className="section-text">
                  In no event shall Geoffrey Munene or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Geoffrey Munene's website, even if Geoffrey Munene or a Geoffrey Munene authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
                <p className="section-text">
                  Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">5. Accuracy of Materials</h2>
                <p className="section-text">
                  The materials appearing on Geoffrey Munene's website could include technical, typographical, or photographic errors. Geoffrey Munene does not warrant that any of the materials on its website are accurate, complete, or current. Geoffrey Munene may make changes to the materials contained on its website at any time without notice. However, Geoffrey Munene does not make any commitment to update the materials.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">6. Links</h2>
                <p className="section-text">
                  Geoffrey Munene has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Geoffrey Munene of the site. Use of any such linked website is at the user's own risk.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">7. Modifications</h2>
                <p className="section-text">
                  Geoffrey Munene may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">8. User Content</h2>
                <p className="section-text">
                  You retain ownership of any content you submit, post, or display on or through the website ("User Content"). By submitting, posting, or displaying User Content on or through the website, you grant Geoffrey Munene a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such User Content in any and all media or distribution methods.
                </p>
                <p className="section-text">
                  You are responsible for your User Content. You represent and warrant that you have all rights, power, and authority necessary to grant the rights granted herein to any User Content that you submit.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">9. Prohibited Uses</h2>
                <p className="section-text">
                  You may not use the website:
                </p>
                <ul className="terms-list">
                  <li>In any way that violates any applicable national or international law or regulation</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                  <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
                </ul>
              </div>

              <div className="terms-section">
                <h2 className="section-title">10. Intellectual Property Rights</h2>
                <p className="section-text">
                  The website and its original content, features, and functionality are and will remain the exclusive property of Geoffrey Munene and its licensors. The website is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">11. Termination</h2>
                <p className="section-text">
                  We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the website will cease immediately.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">12. Governing Law</h2>
                <p className="section-text">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which Geoffrey Munene operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div className="terms-section">
                <h2 className="section-title">13. Contact Information</h2>
                <p className="section-text">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <p className="contact-info">
                  Email: <a href="mailto:munenemuchokiofficial@gmail.com" className="contact-link">munenemuchokiofficial@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Terms

