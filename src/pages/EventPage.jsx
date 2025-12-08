import React, { useState, useEffect, useRef } from "react";
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
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const isLoggedIn = !!localStorage.getItem("authToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("authToken");

  const location = useLocation();
  
  // Debounce refs
  const likeTimeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);

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
        checkIfSaved();
      }
    } else {
      console.warn('⚠️ No eventId provided');
      setError('Event ID không có');
      setLoading(false);
    }

    return () => {
      if (likeTimeoutRef.current) clearTimeout(likeTimeoutRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
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
        setSaveCount(response.data.data.saveCount || 0);
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
      const response = await axios.get(`${API_URL}/events/${eventId}/check-liked`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(response.data.isLiked);
    } catch (err) {
      console.error('Check like error:', err);
    }
  };

  const checkIfSaved = async () => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await axios.get(`${API_URL}/events/${eventId}/check-saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(response.data.isSaved);
      setSaveCount(response.data.saveCount || 0);
    } catch (err) {
      console.error('Check save error:', err);
    }
  };

  const handleLikeClick = async (e) => {
    e?.stopPropagation();

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập để truy cập sự kiện" }
      });
      return;
    }

    // Cập nhật UI ngay lập tức (Optimistic Update)
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);

    // Hủy timeout cũ (nếu còn)
    if (likeTimeoutRef.current) {
      clearTimeout(likeTimeoutRef.current);
    }

    // Đặt timeout mới - chờ 300ms rồi gửi API
    likeTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.post(
          `${API_URL}/events/${eventId}/toggle-like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          // Cập nhật lại từ server (để sync)
          setIsLiked(response.data.data.isLiked);
          setLikeCount(response.data.data.interestingCount);
        }
      } catch (err) {
        console.error("Like event error:", err);
        // Revert nếu có lỗi
        setIsLiked(!newIsLiked);
        setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1);
      } finally {
        likeTimeoutRef.current = null;
      }
    }, 300);
  };

  const handleSaveClick = async (e) => {
    e?.stopPropagation();

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập để truy cập sự kiện" }
      });
      return;
    }
    // If user HAS saved already -> unsave directly (no modal)
    if (isSaved) {
      try {
        // optimistic UI: disable double clicks by briefly toggling
        const resp = await axios.post(
          `${API_URL}/events/${eventId}/toggle-save`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resp.data && resp.data.success) {
          setIsSaved(resp.data.isSaved);
          setSaveCount(resp.data.saveCount);
        }
      } catch (err) {
        console.error('Unsave error:', err);
      }
      return;
    }

    // If not saved -> open SaveModal so user can pick a folder
    setShowSaveModal(true);
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
          <button onClick={() => navigate("/")} className="ev-back-btn">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page-container">
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
          <div className="ev-action-buttons">
            <div className="ev-buttons-left">
              <button
                className={`ev-like-btn ${isLiked ? "liked" : ""}`}
                onClick={handleLikeClick}
              >
                <span className="heart-icon">
                  {isLiked ? "❤️" : "🤍"}
                </span>
                <span className="like-count">{likeCount}</span>
              </button>

              <button
                className={`ev-save-btn ${isSaved ? "saved" : ""}`}
                onClick={handleSaveClick}
              >
                <span className="save-icon">
                  {isSaved ? "🔖" : "🔖"}
                </span>
                <span className="save-count">{saveCount}</span>
              </button>
            </div>

            <div className="ev-buttons-right">
              <button
                className="ev-action-btn ev-reminder-btn"
                onClick={() => setShowReminderModal(true)}
              >
                Reminder
              </button>

              <button
                className="ev-action-btn ev-register-btn"
                onClick={handleRegisterClick}
                disabled={!event.registrationFormUrl}
              >
                Đăng ký
              </button>
            </div>
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
            <button onClick={() => navigate("/")} className="ev-back-btn">
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
        onSaveSuccess={() => {
          // Parent callback invoked after successful save inside modal
          setIsSaved(true);
          setSaveCount((c) => c + 1);
        }}
        API_URL={API_URL}
        token={token}
      />
    </div>
  );
};

export default EventPage;