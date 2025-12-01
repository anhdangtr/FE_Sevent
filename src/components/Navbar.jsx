import React, { useState } from 'react';
import logoImage from '../assets/official_logo_white.png'; // Adjust the path to your logo image 
import { Link, useLocation } from 'react-router-dom';  // Import Link and useLocation from react-router-dom
import './Navbar.css'; // Import the Navbar CSS

function Navbar() {
  const [activeNav, setActiveNav] = useState('home'); // Track the active navigation state
  const location = useLocation(); // Get the current URL location

  // Update the active link based on the current URL
  React.useEffect(() => {
    const path = location.pathname; // Get current path from location
    if (path === "/") {
      setActiveNav('home');
    } else if (path === "/about") {
      setActiveNav('about');
    } else if (path === "/contact") {
      setActiveNav('contact');
    }
  }, [location]);

  const handleChange = (event) => {
      if(event === "LogIn")
        window.location.href='/auth/LogIn';
      else if (event === "SignUp")
        window.location.href ='/auth/SignUp';
  }

  return (
   <div className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="navbar-logo">
          <img src={logoImage} alt="Logo" />
        </div>

        {/* Navbar Links */}
        <ul className="nav-links">
          <li className="nav-link">
            <Link
              to="/"
              className={`nav-link-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => setActiveNav('home')}
            >
              Home
            </Link>
          </li>
          <li className="nav-link">
            <Link
              to="/about"
              className={`nav-link-item ${activeNav === 'about' ? 'active' : ''}`}
              onClick={() => setActiveNav('about')}
            >
              About
            </Link>
          </li>
          <li className="nav-link">
            <Link
              to="/contact"
              className={`nav-link-item ${activeNav === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveNav('contact')}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Authentication Buttons */}
        <div className="auth-buttons">
          <button className="login-btn" onClick={()=>handleChange("LogIn")}>Log In</button>
          <button className="signup-btn" onClick={() => handleChange("SignUp")}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
