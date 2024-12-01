import React from "react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout title="About">
      <div className="profile-card">
        <div>
          <img
            className="avatar"
            src="/img/me.jpeg"
            alt=""
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginTop: 0 }} className="page-title">David Disch</h1>
            <h2 className="page-subtitle">Software Engineer</h2>
          </div>
        </div>
      </div>
      <p>
        react developer by day. rust enthusiast by night. ai dabbler. hardware
        tinkerer. open source contributor. opinions are my own.
      </p>
      <p>
        Apple Contact Key Verification: APKTIDuyQR3wY2TurZO49T4vQ3EVIUGwOV1d21Z7V3dXVIK0_2KQ
      </p>
    </Layout>
  );
}
