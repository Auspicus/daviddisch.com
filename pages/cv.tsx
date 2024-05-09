import React from "react";
import Layout from "../components/Layout";

const data = {
  experience: [
    {
      company: "March & Ash",
      position: "Senior Software Engineer - Data",
      date: "Oct 2023 - Present",
      description:
        `<ul class="reset-list">
          <li>Setup multi-cloud environment across AWS and Google Cloud</li>
          <li>Redesigned data pipeline for better business intelligence</li>
          <li>Integrated automated tests into CI/CD pipeline</li>
          <li>Centralized secret management to solidify security posture</li>
          <li>Reduced monthly cloud services costs by 30%</li>
          <li>Reduced memory usage of key service by 1000%</li>
        </ul>`,
    },
    {
      company: "Container Exchange Services",
      position: "Senior Software Engineer - Customer Experience",
      date: "Jan - Oct 2023",
      description: `<ul class="reset-list">
        <li>Setup the company-wide Node infrastructure running in Kubernetes clusters in two separate cloud providers (AWS and Oracle), including instrumentation and database connectivity using JDBC and Postgres client</li>
        <li>Implemented company-wide OAuth from Auth0 using OpenPolicyAgent (Go) for IDP-independent access rules achieving a unified authorization  strategy with team specific rules</li>
        <li>Built event-driven, idempotent APIs in Node, Java and Go in the customer domain which integrate with Kafka for queueing, concurrency management and transparency for our data team</li>
        <li>Integrated HashiCorp Vault into CI/CD process and Kubernetes pods to facilitate credential rotation and least-privilege access control</li>
        <li>Planned and implemented database migration strategy for zero-downtime deploys and static analysis backed integration guarantees (typed database using Prisma)</li>
      </ul>`,
    },
    {
      company: "March & Ash",
      position: "Senior Software Engineer - eCommerce",
      date: "Dec 2019 - Jan 2023",
      description:
        `<ul class="reset-list">
          <li>Optimized page weight and webpack configuration to deliver faster page loads</li>
          <li>Helped design, test and integrate key features of the website</li>
          <li>Profiled and optimized Core Web Vitals using Lighthouse</li>
          <li>Worked in a team to peer review code changes</li>
          <li>Consulted with Gatsby core team to improve build times</li>
          <li>Utilized Percy automated visual regression testing</li>
          <li>Integrated Algolia search as a service into workflow</li>
          <li>Orchestrated complex checkout process within Redux</li>
          <li>Released React native app with react-native-web on App Store and Play Store</li>
          <li>Centralized teams and codebases within a monorepo</li>
          <li>Developed React components within Gatsby framework</li>
          <li>Supported scanning products &amp; printing receipts at point-of-sale</li>
          <li>Built unit and functional tests using Jest</li>
        </ul>`,
    },
    {
      company: "Sonesta Hotels & Resorts",
      position: "Software Engineer - Booking",
      date: "Sep 2016 - Dec 2019",
      description:
        `<ul class="reset-list">
          <li>Built and maintained React-based component library for 3rd party booking widget</li>
          <li>Custom integration with third party CRM and booking management SynXis</li>
          <li>Developed custom internal Drupal modules in PHP</li>
          <li>Contributed to the development of open source Drupal modules</li>
          <li>Integrated complex SOAP and REST APIs from GuestWare and SynXis</li>
          <li>Handled authentication system for over 200k users and managed database security</li>
          <li>Maintained extensive legacy code and systems</li>
          <li>Created REST endpoints for session data and logins</li>
          <li>Built and maintained local dev environments using Docker</li>
          <li>Implemented A/B testing using Google Optimize</li>
          <li>Discussed and PoC A/B testing via VCL configuration</li>
          <li>Worked with Fastly APIs to configure VCL for Gatsby hosted files</li>
          <li>Eliminated blockers and received requirements through daily scrum calls</li>
          <li>Constructed an interactive Google Maps experience</li>
          <li>Optimized frontend experience by implementing new browser APIs</li>
          <li>Migrated content and custom Drupal site from D7 to D8</li>
          <li>Contributed patches to Gatsby core and Drupal modules to enable headless</li>
      </ul>`,
    },
  ],
  languages: [
    {
      name: 'TypeScript',
      level: 0.9,
      color: '#2f74c0',
      textColor: '#fff',
    },
    {
      name: 'Rust',
      level: 0.5,
      color: '#ce412b',
      textColor: '#fff'
    },
    {
      name: 'Python',
      level: 0.3,
      color: '#3771a2',
      textColor: '#fff'
    },
    {
      name: 'Go',
      level: 0.3,
      color: '#08afd8',
      textColor: '#fff'
    },
    {
      name: 'Java',
      level: 0.2,
      color: '#f89b24',
      textColor: '#fff'
    },
    {
      name: 'C++',
      level: 0.15,
      color: '#007cc7',
      textColor: '#fff'
    },
    {
      name: 'C',
      level: 0.15,
      color: '#007cc7',
      textColor: '#fff'
    },
    {
      name: 'C#',
      level: 0.1,
      color: '#a37add',
      textColor: '#fff',
    },
  ],
  education: [
    {
      name: "Harvard CS50 Certification",
      date: "2018",
    },
    {
      name: "Acquia Certified Drupal 8 Developer",
      date: "2018",
    },
  ],
};

export default function CV({}) {
  return (
    <Layout title="CV">
      <div className="page-cv">
        <section style={{ pageBreakAfter: 'always' }} className="cv-section">
          <div></div>
          <div>
            <h1 className="page-title">David Disch</h1>
            <h2 className="page-subtitle">Software Engineer</h2>
            <p>
              <b>GitHub</b> <a href="https://github.com/auspicus">@auspicus</a><br/>
              <b>Drupal</b> <a href="https://drupal.org/u/edisch">https://drupal.org/u/edisch</a><br/>
              <b>Open source</b> <a href="https://daviddisch.com/open-source">https://daviddisch.com/open-source</a><br/>
            </p>
          </div>
        </section>

        <section style={{ pageBreakAfter: 'always' }} className="cv-section">
          <h3 className="cv-section-heading">Experience</h3>
          <div className="cv-section-content">
            {data.experience.map((e) => (
              <div key={e.date + e.company} className="cv-section-item">
                <div className="cv-date">{e.date}</div>
                <h4 className="cv-title">{e.company}</h4>
                <h5 className="cv-subtitle">{e.position}</h5>
                <div
                  className="cv-description"
                  dangerouslySetInnerHTML={{ __html: e.description }}
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ pageBreakAfter: 'always' }} className="cv-section">
          <h3 className="cv-section-heading">Languages</h3>
          <div className="cv-section-content">
            {data.languages.sort((a, b) => b.level - a.level).map((l) => (
              <div key={l.name} className="cv-section-item">
                <div className="cv-lang">
                  <span style={{ backgroundColor: l.color, width: `${l.level * 100}%` }} className="cv-lang-bg"></span>
                  <span style={{ color: l.textColor }} className="cv-lang-title">{l.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ pageBreakAfter: 'always' }} className="cv-section">
          <h3 className="cv-section-heading">Education</h3>
          <div className="cv-section-content">
            {data.education.map((e) => (
              <div key={e.date + e.name} className="cv-section-item">
                <div className="cv-date">{e.date}</div>
                <h4 className="cv-title">{e.name}</h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
