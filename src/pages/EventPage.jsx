import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";
import ReminderModal from "../components/ReminderModal";
import SaveModal from "../components/SaveModal";
import "./EventPage.css";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const isLoggedIn = !!localStorage.getItem("authToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("authToken");

  const location = useLocation();

  useEffect(() => {
    // Require authentication before loading event details
    if (!isLoggedIn) {
      // Redirect to login and preserve return path
      navigate('/auth/LogIn', { state: { from: location.pathname } });
      return;
    }

    if (eventId) {
      console.log('🔍 EventPage mounted with eventId:', eventId);
      fetchEventDetails();
      if (isLoggedIn) {
        checkIfLiked();
      }
    } else {
      console.warn('⚠️ No eventId provided');
      setError('Event ID không có');
      setLoading(false);
    }
  }, [eventId, isLoggedIn, navigate, location]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);

      // Validate eventId format
      if (!eventId || !eventId.match(/^[0-9a-fA-F]{24}$/)) {
        setError(`Event ID không hợp lệ: ${eventId}/:id`);
        setLoading(false);
        return;
      }

      const url = `${API_URL}/events/${eventId}`;
      console.log('Fetching from:', url);

      // Require token to view event details
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth/LogIn', { state: { from: location.pathname, message: 'Vui lòng đăng nhập để truy cập sự kiện' } });
        return;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setEvent(response.data.data);
        setLikeCount(response.data.data.interestingCount || 0);
      } else {
        setError('Sự kiện không tồn tại');
      }
    } catch (err) {
      console.error('Fetch event error:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Không thể tải chi tiết sự kiện';
      setError(message);
      if (err.response?.status === 401 || (message && message.toLowerCase().includes('vui lòng đăng nhập'))) {
        navigate('/auth/LogIn', { state: { from: location.pathname, message } });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await axios.get(`${API_URL}/events/${eventId}/check-like`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(response.data.isLiked);
    } catch (err) {
      console.error('Check like error:', err);
    }
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      navigate('/auth/LogIn');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/events/${eventId}/toggle-like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );

      if (response.data.success) {
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.interestingCount);
      }
    } catch (err) {
      console.error("Like event error:", err);
    }
  };

  const handleNavClick = (nav, path) => {
    setActiveNav(nav);
    if (path) navigate(path);
  };

  const toggleAvatarMenu = () => setShowAvatarMenu((s) => !s);
  const closeAvatarMenu = () => setShowAvatarMenu(false);

  const handleRegisterClick = () => {
    if (event?.registrationFormUrl) {
      window.open(event.registrationFormUrl, "_blank");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="event-page-container">
          {/* <Navbar activeNav={activeNav} setActiveNav={setActiveNav} /> */}
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-logo">
              <img src={logoImage} alt="S Event Logo" />
            </div>
          </div>
        </nav>
        <div className="loading-state">Đang tải sự kiện...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-page-container">
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-logo">
              <img src={logoImage} alt="S Event Logo" />
            </div>
          </div>
        </nav>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="back-btn">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={logoImage} alt="S Event Logo" />
          </div>
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
          </ul>

          <div className="auth-buttons">
            {!isLoggedIn ? (
              <>
                <button
                  className="login-btn"
                  onClick={() => navigate('/auth/LogIn')}
                >
                  Login
                </button>
                <button
                  className="signup-btn"
                  onClick={() => navigate('/auth/SignUp')}
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
                        navigate("/saved");
                        closeAvatarMenu();
                      }}
                    >
                      Saved event
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
                        window.location.reload();
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

      {/* Banner */}
      <div className="event-banner">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} />
        ) : (
          <div className="banner-placeholder">Không có hình ảnh</div>
        )}
      </div>

      {/* Event Details */}
      <div className="event-details-container">
        <div className="event-details-wrapper">
          {/* Title */}
          <h1 className="event-title">{event.title}</h1>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="register-btn"
              onClick={handleRegisterClick}
              disabled={!event.registrationFormUrl}
            >
              Đăng ký
            </button>
            <button
              className={`like-btn ${isLiked ? "liked" : ""}`}
              onClick={handleLikeClick}
            >
              <span className="heart-icon">
                {isLiked ? "❍" : "🤍"}
              </span>
              <span className="like-count">{likeCount}</span>
            </button>
            <button
              className="register-btn"
              onClick={() => setShowReminderModal(true)}
              style={{ backgroundColor: '#FF9800' }}
            >
              ⏰ Reminder
            </button>
            <button
              className="register-btn"
              onClick={() => setShowSaveModal(true)}
              style={{ backgroundColor: '#4CAF50' }}
            >
              💾 Save
            </button>
          </div>

          {/* Event Info Section */}
          <div className="event-info-section">
            <div className="info-item">
              <span className="info-label">⏰ Thời gian bắt đầu:</span>
              <span className="info-value">
                {formatDate(event.startDate)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">⏰ Thời gian kết thúc:</span>
              <span className="info-value">
                {formatDate(event.endDate)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">📍 Địa điểm:</span>
              <span className="info-value">{event.location || "Chưa xác định"}</span>
            </div>

            <div className="info-item">
              <span className="info-label">🏢 Tổ chức:</span>
              <span className="info-value">
                {event.organization || "Chưa xác định"}
              </span>
            </div>

            {event.formSubmissionDeadline && (
              <div className="info-item">
                <span className="info-label">📝 Hạn đăng ký:</span>
                <span className="info-value">
                  {formatDate(event.formSubmissionDeadline)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="event-description-section">
            <h2>Mô tả sự kiện</h2>
            {event.shortDescription && (
              <div className="short-description">
                <p>{event.shortDescription}</p>
              </div>
            )}
            {event.content && (
              <div className="full-description">
                <p>{event.content}</p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="back-button-section">
            <button onClick={() => navigate("/")} className="back-btn">
              ← Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        eventId={eventId}
        eventTitle={event?.title || ''}
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        API_URL={API_URL}
        token={token}
      />

      {/* Save Modal */}
      <SaveModal
        eventId={eventId}
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        API_URL={API_URL}
        token={token}
      />
    </div>
  );
};

export default EventPage;