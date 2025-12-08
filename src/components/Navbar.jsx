import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import "./Navbar.css";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ activeNav, setActiveNav }) => {
  const navigate = useNavigate();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const isLoggedIn = !!localStorage.getItem("authToken");
  let user = null;

  try {
    const token = localStorage.getItem("authToken");
    // console.log(token);
    if (token) 
      {
        user = jwtDecode(token)
      };
    // console.log(user);
  } catch (err) {
    console.error("Decode token error", err);
  }

  const handleNavClick = (nav, path) => {
    setActiveNav(nav);
    if (path) navigate(path);
  };

  const toggleAvatarMenu = () => setShowAvatarMenu((s) => !s);
  const closeAvatarMenu = () => setShowAvatarMenu(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo bên trái */}
        <div className="navbar-logo">
          <img src={logoImage} alt="S Event Logo" />
        </div>

        {/* Menu căn giữa */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${activeNav === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home", "/")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeNav === "about" ? "active" : ""}`}
              onClick={() => handleNavClick("about", "/about")}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeNav === "contact" ? "active" : ""}`}
              onClick={() => handleNavClick("contact", "/contact")}
            >
              Contact
            </button>
          </li>
          {
            user?.role === "admin" && (
              <li>
                <button className={`nav-link ${activeNav === "user" ? "active" : ""}`} onClick={() => handleNavClick("user", "/user")}>
                  User
                </button>
              </li>
            )}

        </ul>

        {/* Nút bên phải: Login / Sign up hoặc Avatar */}
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button
                className="login-btn"
                onClick={() => navigate("/auth/LogIn")}
              >
                Login
              </button>
              <button
                className="signup-btn"
                onClick={() => navigate("/auth/SignUp")}
              >
                Sign up
              </button>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <button
                className="login-btn"
                onClick={toggleAvatarMenu}
                aria-haspopup="true"
                aria-expanded={showAvatarMenu}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#fff",
                    marginRight: 8
                  }}
                />
              </button>
              {showAvatarMenu && (
                <div className="avatar-menu" onMouseLeave={closeAvatarMenu}>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      navigate("/interests");
                      closeAvatarMenu();
                    }}
                  >
                    Interesting event
                  </button>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      navigate("/liked");
                      closeAvatarMenu();
                    }}
                  >
                    Liked event
                  </button>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      navigate("/saved");
                      closeAvatarMenu();
                    }}
                  >
                    Saved event
                  </button>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      navigate("/liked");
                      closeAvatarMenu();
                    }}
                  >
                    Liked event
                  </button>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      navigate("/reminders");
                      closeAvatarMenu();
                    }}
                  >
                    Reminders
                  </button>
                  <button
                    className="avatar-menu-item"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
