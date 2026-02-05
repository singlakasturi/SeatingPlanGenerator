import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" />
      </header>

      <div className="nav-bar">
        <div className="nav-left">
          <img src="/seating planner logo.png" alt="Seating Planner Logo" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>

        <div className="nav-right">
          <a href="#contact">CONTACT US</a>
          <a href="#" onClick={handleLoginClick}>
            LOGIN
          </a>
        </div>
      </div>

      <div className="main">
        <div className="text-section">
          <h2>Welcome to</h2>
          <h1>SEATING PLAN PROJECT</h1>
          <p>
            Seating Plan Portal is an advanced exam seating planner designed to
            simplify and digitalize exam management. We provide time-saving
            tools for schools, colleges, and institutions to create and manage
            exam seating plans efficiently and effortlessly.
          </p>
          <p className="features">
            <strong>Key Features:</strong>
          </p>
          <ul className="feature-list">
            <li>✓ Automated room allocation based on student data</li>
            <li>✓ Generate seating plans in seconds</li>
            <li>✓ Preview and download plans in multiple formats</li>
            <li>✓ Manage multiple examination schedules</li>
          </ul>
          <button
            className="btn-google"
            type="button"
            aria-label="Sign in with Google"
            onClick={handleLoginClick}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="image-section">
          <img src="/examPhoto.png" alt="Exam illustration" />
        </div>
      </div>

      <footer className="footer" id="contact">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>National Institute of Technology Jalandhar</p>
          <p>Jalandhar-Amritsar Bypass Road, Jalandhar, Punjab - 144011</p>
          <p>Email: support@nitj.ac.in | Phone: +91-181-5037855</p>
        </div>
      </footer>
    </div>
  );
}
