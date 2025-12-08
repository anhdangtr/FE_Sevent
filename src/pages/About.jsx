import React, { useState } from "react";
import "./About.css";
import founder1 from "../assets/founder1.jpg";
import founder2 from "../assets/founder2.JPG";
import { FaFacebook, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";

function About() {
  const [activeNav, setActiveNav] = useState("about");

  return (
    <>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="about-container">
        <div className="about-header">
          <h1>About Sevent</h1>
          <p>Empower VNU-HCM students to discover, manage amazing events</p>
        </div>

        <div className="about-content">
          {/* Our Purpose */}
          <div className="about-description">
            <h2>Our Purpose</h2>
            <p>
              We are a passionate team of students from{" "}
              <strong>
                University of Information Technology (UIT) – VNU-HCM
              </strong>
              . We built Sevent to solve a simple problem we all faced: finding
              and keeping track of campus events.
              <br />
              <br />
              Our goal is simple: help every student easily find events they
              love, register without hassle, and get smart reminders so they
              never miss out.
            </p>
          </div>

          {/* Founders */}
          <div className="founders-section">
            <h2>Meet The Founders</h2>

            <div className="founders">
              <div className="founder-card">
                <img
                  src={founder1}
                  alt="Đặng Trung Anh"
                  className="founder-img"
                />
                <h3>Đặng Trung Anh</h3>
                <p>Back-end Developer</p>
                <p>The backbone of Sevent</p>
                <div className="founder-socials">
                  <a
                    href="https://www.facebook.com/share/1HVHEaKTxF/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                  <a href="mailto:23520038@gm.uit.edu.vn">
                    <FaEnvelope />
                  </a>
                </div>
              </div>

              <div className="founder-card">
                <img
                  src={founder2}
                  alt="Đỗ Thị Như Ý"
                  className="founder-img"
                />
                <h3>Đỗ Thị Như Ý</h3>
                <p>Front-end Developer & UI/UX Designer</p>
                <p>The desinger of web interface</p>
                <div className="founder-socials">
                  <a
                    href="https://www.facebook.com/share/17vuzjH2ZK/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                  <a href="mailto:23521842@gm.uit.edu.vn">
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
