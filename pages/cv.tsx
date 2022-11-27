import React from 'react'
import Layout from '../components/Layout'

const data = {
  "experience": [{
    "company": "Desarol",
    "position": "Director of Technology",
    "date": "2016 - Present",
    "description": "<ul class=\"reset-list\"><li>Developed React components within Gatsby framework</li><li>Optimized payload and deliver faster page loads</li><li>Helped design and integrate key features of the website</li><li>Profiled and optimized performance using Lighthouse</li><li>Worked in a team to peer review code changes as part of CI/CD</li><li>Consulted with Gatsby core team whilst improving build times</li><li>Utilized Percy automated visual regression testing</li><li>Integrated Algolia search as a service into workflow</li><li>Organised client-side state changes and flow with Redux</li><li>Released React native app on App Store and Play Store</li><li>Supported scanning products &amp; printing receipts at point-of-sale</li><li>Improved DevOps by integrating automated tests into CI/CD</li><li>Built unit and functional tests using Jest</li></ul>"
  }],
  "education": [{
    "name": "Harvard CS50 Certification",
    "date": "2018"
  }, {
    "name": "Acquia Certified Drupal 8 Developer",
    "date": "2018"
  }]
}

export default function CV({  }) {
  return (
    <Layout title="CV">
      <div className="page-cv">
        <section className="cv-section">
          <div></div>
          <div>
            <h1 className="page-title">David Disch</h1>
            <h2 className="page-subtitle">Software Engineer</h2>
          </div>
        </section>

        <section className="cv-section">
          <h3 className="cv-section-heading">Experience</h3>
          <div className="cv-section-content">
            {data.experience.map(e => (
              <div key={e.date + e.company} className="cv-section-item">
                <div className="cv-date">{e.date}</div>
                <h4 className="cv-title">{e.company}</h4>
                <h5 className="cv-subtitle">{e.position}</h5>
                <div className="cv-description" dangerouslySetInnerHTML={{ __html: e.description }} />
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h3 className="cv-section-heading">Education</h3>
          <div className="cv-section-content">
            {data.education.map(e => (
              <div key={e.date + e.name} className="cv-section-item">
                <div className="cv-date">{e.date}</div>
                <h4 className="cv-title">{e.name}</h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
