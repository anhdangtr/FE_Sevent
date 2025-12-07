import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EventCardTest.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EventCardTest = ({ event }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // 1. Tạo state cho like/save và số lượng
  // ==============================
  const [liked, setLiked] = useState(event.isLiked || false); // trạng thái like
  const [likeCount, setLikeCount] = useState(event.interestingCount || 0); // số lượng like
  const [saved, setSaved] = useState(event.isSaved || false); // trạng thái save
  const [saveCount, setSaveCount] = useState(event.saveCount || 0); // số lượng save

  // ==============================
  // 2. Format ngày, giờ và tính khoảng thời gian
  // ==============================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDaysDifference = (date) => {
    if (!date) return 0;
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEvent = getDaysDifference(event.startDate);

  // ==============================
  // 3. Điều hướng đến trang chi tiết
  // ==============================
  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  // ==============================
  // 4. Xử lý Like
  // ==============================
  const handleLike = async (e) => {
    e.stopPropagation(); // ngăn click lan ra div card

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập để truy cập sự kiện" }
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${event._id}/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        // ==============================
        // 4a. Cập nhật trạng thái nút và số lượng ngay lập tức
        // ==============================
        setLiked(data.data.isLiked);
        setLikeCount(data.data.interestingCount);
      }
    } catch (err) {
      console.error("Lỗi toggle like:", err);
    }
  };

  // ==============================
  // 5. Xử lý Save
  // ==============================
  const handleSave = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/LogIn", {
        state: { from: location.pathname, message: "Vui lòng đăng nhập để truy cập sự kiện" }
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${event._id}/toggle-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        // ==============================
        // 5a. Cập nhật trạng thái nút và số lượng ngay lập tức
        // ==============================
        setSaved(data.data.isSaved);
        setSaveCount(data.data.saveCount);
      }
    } catch (err) {
      console.error("Lỗi toggle save:", err);
    }
  };

  return (
    <div className="event-card" onClick={handleCardClick}>
      {/* Banner */}
      <div className="event-banner">
        <img
          src={event.bannerUrl || "https://via.placeholder.com/400x250?text=Event"}
          alt={event.title}
          className="banner-image"
        />

        {/* Badge */}
        {daysUntilEvent > 0 && daysUntilEvent <= 7 && (
          <div className="event-badge coming-soon">Sắp diễn ra</div>
        )}
        {daysUntilEvent < 0 && <div className="event-badge ended">Đã kết thúc</div>}

        {/* Action Buttons */}
        <div className="event-actions">
          <button
            className={`action-btn like-btn ${liked ? "active" : ""}`} // active nếu đã like
            onClick={handleLike}
            title="Thích"
          >
            ♥️
          </button>
          <button
            className={`action-btn save-btn ${saved ? "active" : ""}`} // active nếu đã save
            onClick={handleSave}
            title="Lưu"
          >
            🔖
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="event-content">
        {/* Title */}
        <h3 className="event-title">{event.title}</h3>

        {/* Description */}
        <p className="event-description">{event.shortDescription || event.content}</p>

        {/* Date & Time */}
        <div className="event-datetime">
          <div className="datetime-item">
            <span className="datetime-icon">📅</span>
            <span className="datetime-text">
              {formatDate(event.startDate)} {formatTime(event.startDate)}
            </span>
          </div>
          <div className="datetime-item">
            <span className="datetime-icon">🏁</span>
            <span className="datetime-text">
              {formatDate(event.endDate)} {formatTime(event.endDate)}
            </span>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="event-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{event.location}</span>
          </div>
        )}

        {/* Stats */}
        <div className="event-stats">
          <div className="stat-item">
            <span>❤️ {likeCount}</span> {/* dùng state cập nhật */}
          </div>
          <div className="stat-item">
            <span>🔖 {saveCount}</span> {/* dùng state cập nhật */}
          </div>
          {daysUntilEvent > 0 && (
            <div className="stat-item days-left">
              <span>{daysUntilEvent} ngày nữa</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button className="event-cta-btn">Xem Chi Tiết →</button>
      </div>
    </div>
  );
};

export default EventCardTest;
