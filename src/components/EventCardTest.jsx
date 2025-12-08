import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EventCardTest.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EventCardTest = ({ event }) => {
  const navigate = useNavigate();
  const location = useLocation();
 
  // 1. Tạo state cho like/save và số lượng

  const [liked, setLiked] = useState(event.isLiked || false);
  const [likeCount, setLikeCount] = useState(event.interestingCount || 0);
  const [saved, setSaved] = useState(event.isSaved || false);
  const [saveCount, setSaveCount] = useState(event.saveCount || 0);
  const [loading, setLoading] = useState(true); // trạng thái loading

  //debounce xử lý sì pam
  const debounceTimeoutRef = useRef({
  like: null,
  save: null
});

  const DEBOUNCE_DELAY = 500; // 500ms

  // ==============================
  // 2. useEffect - Check trạng thái like và save khi component mount
  // ==============================
  useEffect(() => {
    const checkStatuses = async () => {
      const token = localStorage.getItem("authToken");
      
      // Nếu không có token, không cần check
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Check like status
        const likeRes = await fetch(`${API_URL}/events/${event._id}/check-liked`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const likeData = await likeRes.json();
        if (likeData.success) {
          setLiked(likeData.isLiked);
          if (likeData.likeCount !== undefined) {
            setLikeCount(likeData.likeCount);
          }
        }
      } catch (err) {
        console.error("Lỗi check status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStatuses();
  }, [event._id]); // re-check khi event id thay đổi

// THÊM VÀO useEffect - Check Save Status khi component mount
useEffect(() => {
  const checkStatuses = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Check like status
      const likeRes = await fetch(`${API_URL}/events/${event._id}/check-liked`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const likeData = await likeRes.json();
      if (likeData.success) {
        setLiked(likeData.isLiked);
        if (likeData.likeCount !== undefined) {
          setLikeCount(likeData.likeCount);
        }
      }

      // ========== THÊM: Check save status ==========
      const saveRes = await fetch(`${API_URL}/events/${event._id}/check-saved`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        setSaved(saveData.isSaved);
        if (saveData.saveCount !== undefined) {
          setSaveCount(saveData.saveCount);
        }
      }
      // ==========================================

    } catch (err) {
      console.error("Lỗi check status:", err);
    } finally {
      setLoading(false);
    }
  };

  checkStatuses();
}, [event._id]);

  // ==============================
  // 3. Format ngày, giờ và tính khoảng thời gian
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
  // 4. Điều hướng đến trang chi tiết
  // ==============================
  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  // 5. Xử lý Like
const handleLike = async (e) => {
  e.stopPropagation();

  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/auth/LogIn", {
      state: { from: location.pathname, message: "Vui lòng đăng nhập để truy cập sự kiện" }
    });
    return;
  }

  // Cập nhật UI ngay lập tức
  const newLiked = !liked;
  setLiked(newLiked);
  setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);

  //Hủy timeout cũ (nếu còn)
  if (debounceTimeoutRef.current.like) {
    clearTimeout(debounceTimeoutRef.current.like);
  }

  // Đặt timeout mới - chờ 500ms rồi gửi API
  debounceTimeoutRef.current.like = setTimeout(async () => {
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
        // Cập nhật lại từ server (để sync)
        setLiked(data.data.isLiked);
        setLikeCount(data.data.interestingCount);
      }
    } catch (err) {
      console.error("Lỗi toggle like:", err);
    }
  }, DEBOUNCE_DELAY);
};

  // ==============================
  // 6. Xử lý Save
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

  // Cập nhật UI ngay lập tức
  const newSaved = !saved;
  setSaved(newSaved);
  setSaveCount(newSaved ? saveCount + 1 : saveCount - 1);

  // Hủy timeout cũ
  if (debounceTimeoutRef.current.save) {
    clearTimeout(debounceTimeoutRef.current.save);
  }

  //Đặt timeout mới - chờ 500ms rồi gửi API
  debounceTimeoutRef.current.save = setTimeout(async () => {
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
        // Cập nhật lại từ server (để sync)
        setSaved(data.data.isSaved);
        setSaveCount(data.data.saveCount);
      }
    } catch (err) {
      console.error("Lỗi toggle save:", err);
    }
  }, DEBOUNCE_DELAY);
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
            className={`action-btn like-btn ${liked ? "active" : ""}`}
            onClick={handleLike}
            title="Thích"
            disabled={loading} // vô hiệu hóa nút khi đang load
          >
            ♥️
          </button>
          <button
            className={`action-btn save-btn ${saved ? "active" : ""}`}
            onClick={handleSave}
            title="Lưu"
            disabled={loading} // vô hiệu hóa nút khi đang load
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
            <span className="datetime-icon">Start: </span>
            <span className="datetime-text">
              {formatDate(event.startDate)} {formatTime(event.startDate)}
            </span>
          </div>
          <div className="datetime-item">
            <span className="datetime-icon">End: </span>
            <span className="datetime-text">
              {formatDate(event.endDate)} {formatTime(event.endDate)}
            </span>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="event-location">
            <span className="location-icon">Location: </span>
            <span className="location-text">{event.location}</span>
          </div>
        )}

        {/* Stats */}
        <div className="event-stats">
          <div className="stat-item">
            <span>❤️ {likeCount}</span>
          </div>
          <div className="stat-item">
            <span>🔖 {saveCount}</span>
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