import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = ({ activeNav, setActiveNav }) => {
  const navigate = useNavigate();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const isLoggedIn = !!localStorage.getItem("authToken");
  let user = null;

  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      user = jwtDecode(token);
    }
  } catch (err) {
    console.error("Decode token error", err);
  }

  // Fetch user profile từ API
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${API_URL}/api/info/${user.id}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
          }
        } catch (error) {
          console.error("Fetch user profile error", error);
        }
      };
      
      fetchUserProfile();
    }
  }, [isLoggedIn, user?.id]);

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
        <ul className="navbar-nav-links">
          <li>
            <button
              className={`navbar-nav-link ${activeNav === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home", "/")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`navbar-nav-link ${activeNav === "about" ? "active" : ""}`}
              onClick={() => handleNavClick("about", "/about")}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`navbar-nav-link ${activeNav === "contact" ? "active" : ""}`}
              onClick={() => handleNavClick("contact", "/contact")}
            >
              Contact
            </button>
          </li>
          {user?.role === "admin" && (
            <li>
              <button 
                className={`navbar-nav-link ${activeNav === "user" ? "active" : ""}`} 
                onClick={() => handleNavClick("user", "/user")}
              >
                User
              </button>
            </li>
          )}
        </ul>

        {/* Nút bên phải: Login / Sign up hoặc Avatar */}
        <div className="navbar-auth-buttons">
          {!isLoggedIn ? (
            <>
              <button
                className="navbar-login-btn"
                onClick={() => navigate("/auth/LogIn")}
              >
                Login
              </button>
              <button
                className="navbar-signup-btn"
                onClick={() => navigate("/auth/SignUp")}
              >
                Sign up
              </button>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <button
                className="navbar-avatar-btn"
                onClick={toggleAvatarMenu}
                aria-haspopup="true"
                aria-expanded={showAvatarMenu}
              >
                <div className="navbar-avatar-placeholder">
                  {userInfo?.email?.[0]?.toUpperCase() || "U"}
                </div>
              </button>
              {showAvatarMenu && (
                <div className="navbar-avatar-menu" onMouseLeave={closeAvatarMenu}>
                  {/* Profile Info Section */}
                  <div className="navbar-avatar-menu-header">
                    <div className="navbar-avatar-menu-avatar">
                      {userInfo?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="navbar-avatar-menu-info">
                      <p className="navbar-avatar-menu-name">{userInfo?.name || "User"}</p>
                      <p className="navbar-avatar-menu-subtitle">Tài khoản đã xác thực</p>
                      <p className="navbar-avatar-menu-email">{userInfo?.email || ""}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    className="navbar-avatar-menu-item"
                    onClick={() => {
                      navigate("/liked");
                      closeAvatarMenu();
                    }}
                  >
                    Liked event
                  </button>
                  <button
                    className="navbar-avatar-menu-item"
                    onClick={() => {
                      navigate("/saved");
                      closeAvatarMenu();
                    }}
                  >
                    Saved event
                  </button>
                  <button
                    className="navbar-avatar-menu-item"
                    onClick={() => {
                      navigate("/reminders");
                      closeAvatarMenu();
                    }}
                  >
                    Reminders
                  </button>
                  <button
                    className="navbar-avatar-menu-item"
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