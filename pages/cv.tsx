import React from "react";
import Layout from "../components/Layout";

const data = {
  experience: [
    {
      company: "March & Ash",
      position: "Principal Software Engineer - Data",
      date: "Oct 2023 - Present",
      description:
        `<p>Setup multi-cloud environment across AWS and Google Cloud. Conducted organization-wide security audit. <b>Reduced monthly cloud services costs by 30%. Reduced memory usage of key service by 1000%.</b></p>`,
    },
    {
      company: "Container Exchange Services",
      position: "Senior Software Engineer - Customer Experience",
      date: "Jan - Oct 2023",
      description: `<p>Worked with DevOps team to setup the org-wide Node infra (instrumentation and database connectivity with JDBC and Postgres to AWS Aurora) running in K8s clusters in both AWS EKS and Oracle OKE.
      Implemented org-wide OAuth from Auth0 using OpenPolicyAgent (Go) for IDP-independent access rules achieving a unified authorization strategy with service level granularity.
      Built event-driven, idempotent APIs in Node, Java and Go in the customer domain which integrate with Kafka for queueing, concurrency management and transparency for our data team.
      Integrated HashiCorp Vault into GitHub actions CI/CD and Kubernetes pods to facilitate credential rotation and least-privilege service access.
      Planned and implemented database migration strategy for zero-downtime deploys and static analysis backed integration guarantees (typed database using Prisma).</p>`,
    },
    {
      company: "March & Ash",
      position: "Principal Software Engineer - eCommerce",
      date: "Dec 2019 - Jan 2023",
      description:
        `<p>Led the team responsible for moving an expanding San Diego retailer's operation online.
        Focused on providing our mostly mobile audience with a performant, industry-leading ordering experience with our Gatsby web app and React Native app published to Google Play Store and Apple App Store.
        Contributed to the Gatsby framework to integrate with third-party point of sale system.
        Advocated for a rigorous automated testing approach (using Jest and Percy) of our applications to maximize reliability and visual consistency and minimize downtime.
        Experimented with react-native-web to unify development teams.</p>
        `,
    },
    {
      company: "Sonesta Hotels & Resorts",
      position: "Software Engineer - Booking",
      date: "Sep 2016 - Dec 2019",
      description:
        `<p>Migrated 200+ multilingual hotels from Drupal 7 to headless Drupal 8 and Gatsby.
        Integrated SOAP and REST APIs from Guestware and SynXis for booking management and loyalty program.
        Created an open-source client library for Guestware in JavaScript.
        Contributed to open-source Drupal modules including an image optimizing proxy.
        Handled userbase for over 200k customers.
        Managed devops for team including local mock environments and Docker images.
        Implemented and advocated for A/B tested feature development using Fastly VCL for traffic splitting.
        Discussed A/B testing capabilities of Gatsby framework with core team.
        </p>`,
    },
  ],
  languages: [
    {
      name: '.ts',
      level: 1.0,
      color: '#2f74c0',
      textColor: '#fff',
    },
    {
      name: '.rs',
      level: 0.4,
      color: '#ce412b',
      textColor: '#fff'
    },
    {
      name: '.py',
      level: 0.4,
      color: '#3771a2',
      textColor: '#fff'
    },
    {
      name: '.go',
      level: 0.4,
      color: '#08afd8',
      textColor: '#fff'
    },
    {
      name: '.java',
      level: 0.3,
      color: '#f89b24',
      textColor: '#fff'
    },
    {
      name: '.cpp',
      level: 0.3,
      color: '#007cc7',
      textColor: '#fff'
    },
    {
      name: '.c',
      level: 0.3,
      color: '#007cc7',
      textColor: '#fff'
    },
    {
      name: '.cs',
      level: 0.3,
      color: '#a37add',
      textColor: '#fff',
    },
  ],
  education: [
    {
      name: "Harvard CS50",
      date: "2018",
    },
    {
      name: "Acquia D8 Dev",
      date: "2018",
    },
  ],
};

export default function CV({}) {
  return (
    <Layout title="CV">
      <div className="page-cv">
        <section className="cv-section">
          <div>
            <div style={{ textAlign: 'right' }}>
              <h1 className="page-title">David Disch</h1>
              <h2 className="page-subtitle">Software Engineer</h2>
              <p style={{ marginBottom: '2rem' }}>
                <a href="https://github.com/auspicus">github.com/auspicus</a><br/>
                <a href="https://drupal.org/u/edisch">drupal.org/u/edisch</a><br/>
                <a href="https://daviddisch.com/oss">daviddisch.com/oss</a><br/>
              </p>
            </div>
            <div className="cv-education cv-section-content">
              <h3 className="cv-section-heading sr-only">Education</h3>
              {data.education.map((e) => (
                <div key={e.date + e.name} className="cv-section-item">
                  <h4 className="cv-education-title">{e.name} - <span className="cv-education-date">{e.date}</span></h4>
                </div>
              ))}
            </div>
            <h3 className="cv-section-heading sr-only">Languages</h3>
            <div style={{ marginBottom: '2rem' }}></div>
            <div className="cv-section-content">
              {data.languages.sort((a, b) => b.level - a.level).map((l) => (
                <div key={l.name} className="cv-section-item">
                  <div className="cv-lang">
                    <div style={{ backgroundColor: l.color, width: `${l.level * 100}%` }} className="cv-lang-bg"></div>
                    <span style={{ color: l.textColor }} className="cv-lang-title">{l.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
      </div>
    </Layout>
  );
}
