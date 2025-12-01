import React from "react";
import "./About.css"; // Import the About page CSS

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Learn more about our platform and the people behind it.</p>
      </div>

      <div className="about-content">
        <div className="about-description">
          <h2>Our Purpose</h2>
          <p>
            We created this platform to connect people with exciting events.
            Whether you're looking to attend a conference, a concert, or a local
            gathering, we have something for everyone.
          </p>
        </div>

        <div className="founders-section">
          <h2>Meet The Founders</h2>
          <div className="founders">
            <div className="founder-card">
              <img
                src="https://via.placeholder.com/150"
                alt="Founder 1"
                className="founder-img"
              />
              <h3>John Doe</h3>
              <p>Co-founder & CEO</p>
              <p>
                John has a passion for bringing people together through events.
                He founded the platform to make it easier to discover and attend
                meaningful events.
              </p>
            </div>

            <div className="founder-card">
              <img
                src="https://via.placeholder.com/150"
                alt="Founder 2"
                className="founder-img"
              />
              <h3>Jane Smith</h3>
              <p>Co-founder & CTO</p>
              <p>
                Jane is the tech wizard behind the platform. She ensures that
                the platform runs smoothly and provides a seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
