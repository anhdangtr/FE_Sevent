import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventCardTest.css";

const EventCardTest = ({ event }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Format ngày
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Format giờ
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Tính khoảng thời gian
  const getDaysDifference = (date) => {
    if (!date) return 0;
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEvent = getDaysDifference(event.startDate);

  // Navigate to event detail
  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  // Like event
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    // TODO: Gọi API để update like count
  };

  // Save event
  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    // TODO: Gọi API để update save count
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
        {daysUntilEvent < 0 && (
          <div className="event-badge ended">Đã kết thúc</div>
        )}

        {/* Action Buttons */}
        <div className="event-actions">
          <button
            className={`action-btn like-btn ${liked ? "active" : ""}`}
            onClick={handleLike}
            title="Thích"
          >
            ♥️
          </button>
          <button
            className={`action-btn save-btn ${saved ? "active" : ""}`}
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
        <p className="event-description">
          {event.shortDescription || event.content}
        </p>

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
            <span>❤️ {event.interestingCount || 0}</span>
          </div>
          <div className="stat-item">
            <span>🔖 {event.saveCount || 0}</span>
          </div>
          {daysUntilEvent > 0 && (
            <div className="stat-item days-left">
              <span>{daysUntilEvent} ngày nữa</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button className="event-cta-btn">
          Xem Chi Tiết →
        </button>
      </div>
    </div>
  );
};

export default EventCardTest;