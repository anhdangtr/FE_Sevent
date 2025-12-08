import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";
import ReminderModal from "../components/ReminderModal";
import SaveModal from "../components/SaveModal";
import "./EventPage.css";
import Navbar from "../components/Navbar";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  const [activeNav, setActiveNav] = useState("home");

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const isLoggedIn = !!localStorage.getItem("authToken");
  const token = localStorage.getItem("authToken");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Debounce refs
  const likeTimeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // ========================================
  // LOAD EVENT + CHECK LIKE/SAVE
  // ========================================
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/LogIn", { state: { from: location.pathname } });
      return;
    }

    if (eventId) {
      fetchEventDetails();
      checkIfLiked();
      checkIfSaved();
    } else {
      setError("Event ID không có");
      setLoading(false);
    }

    return () => {
      if (likeTimeoutRef.current) clearTimeout(likeTimeoutRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [eventId, isLoggedIn, navigate, location]);

  // ========================================
  // Fetch Event Details
  // ========================================
  const fetchEventDetails = async () => {
    try {
      setLoading(true);

      if (!eventId || !eventId.match(/^[0-9a-fA-F]{24}$/)) {
        setError(`Event ID không hợp lệ: ${eventId}/:id`);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEvent(response.data.data);
        setLikeCount(response.data.data.interestingCount || 0);
        setSaveCount(response.data.data.saveCount || 0);
      } else {
        setError("Sự kiện không tồn tại");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Không thể tải chi tiết sự kiện";
      setError(message);

      if (
        err.response?.status === 401 ||
        message.toLowerCase().includes("vui lòng đăng nhập")
      ) {
        navigate("/auth/LogIn", {
          state: { from: location.pathname, message },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Check If Liked / Saved
  // ========================================
  const checkIfLiked = async () => {
    if (!isLoggedIn) return;
    try {
      const resp = await axios.get(`${API_URL}/api/events/${eventId}/check-liked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLiked(resp.data.isLiked);
    } catch (err) {
      console.error("Check like error:", err);
    }
  };

  const checkIfSaved = async () => {
    if (!isLoggedIn) return;
    try {
      const resp = await axios.get(`${API_URL}/api/events/${eventId}/check-saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSaved(resp.data.isSaved);
      setSaveCount(resp.data.saveCount || 0);
    } catch (err) {
      console.error("Check save error:", err);
    }
  };

  // ========================================
  // LIKE BUTTON
  // ========================================
  const handleLikeClick = async (e) => {
    e?.stopPropagation();

    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập" },
      });
      return;
    }

    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount(newStatus ? likeCount + 1 : likeCount - 1);

    if (likeTimeoutRef.current) clearTimeout(likeTimeoutRef.current);

    likeTimeoutRef.current = setTimeout(async () => {
      try {
        const resp = await axios.post(
          `${API_URL}/api/events/${eventId}/toggle-like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resp.data.success) {
          setIsLiked(resp.data.data.isLiked);
          setLikeCount(resp.data.data.interestingCount);
        }
      } catch (err) {
        setIsLiked(!newStatus);
        setLikeCount(newStatus ? likeCount - 1 : likeCount + 1);
      }
    }, 300);
  };

  // ========================================
  // SAVE BUTTON
  // ========================================
  const handleSaveClick = async (e) => {
    e?.stopPropagation();

    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập" },
      });
      return;
    }

    if (isSaved) {
      try {
        const resp = await axios.post(
          `${API_URL}/api/events/${eventId}/toggle-save`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resp.data.success) {
          setIsSaved(resp.data.isSaved);
          setSaveCount(resp.data.saveCount);
        }
      } catch (err) {
        console.error("Unsave error:", err);
      }
      return;
    }

    setShowSaveModal(true);
  };

  // ========================================
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
      minute: "2-digit",
    });
  };

  // ========================================
  // UI STATES
  // ========================================
  if (loading) {
    return (
      <>
        <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
        <div className="event-page-container">
          <div className="loading-state">Đang tải sự kiện...</div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
        <div className="event-page-container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => navigate("/")} className="ev-back-btn">
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </>
    );
  }

  // ========================================
  // MAIN RENDER
  // ========================================
  return (
    <>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="event-page-container">
        {/* Banner */}
        <div className="event-banner">
          {event.bannerUrl ? (
            <img src={event.bannerUrl} alt={event.title} />
          ) : (
            <div className="banner-placeholder">Không có hình ảnh</div>
          )}
        </div>

        <div className="event-details-container">
          <div className="event-details-wrapper">
            <h1 className="event-title">{event.title}</h1>

            {/* Action Buttons */}
            <div className="ev-action-buttons">
              <div className="ev-buttons-left">
                <button
                  className={`ev-like-btn ${isLiked ? "liked" : ""}`}
                  onClick={handleLikeClick}
                >
                  <span className="heart-icon">{isLiked ? "❤️" : "🤍"}</span>
                  <span className="like-count">{likeCount}</span>
                </button>

                <button
                  className={`ev-save-btn ${isSaved ? "saved" : ""}`}
                  onClick={handleSaveClick}
                >
                  <span className="save-icon">🔖</span>
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
                  Register
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="event-info-section">
              <div className="info-item">
                <span className="info-label">⏰ Thời gian bắt đầu:</span>
                <span className="info-value">{formatDate(event.startDate)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">⏰ Thời gian kết thúc:</span>
                <span className="info-value">{formatDate(event.endDate)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">📍 Địa điểm:</span>
                <span className="info-value">
                  {event.location || "Chưa xác định"}
                </span>
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
                  {event.content.split("\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Back */}
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
          eventTitle={event.title}
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
            setIsSaved(true);
            setSaveCount((c) => c + 1);
          }}
          API_URL={API_URL}
          token={token}
        />
      </div>
    </>
  );
};

export default EventPage;
