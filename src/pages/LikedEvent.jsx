import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCardTest from "../components/EventCardTest";
import "./LikedEvent.css";
import Navbar from "../components/Navbar";

const LikedEvent = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [likedEvents, setLikedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    fetchLiked();
  }, []);

  const fetchLiked = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLikedEvents([]);
        setLoading(false);
        return;
      }

      // Fetch a large list of events and check like status per event
      const eventsRes = await axios.get(`${API_URL}/events`, { params: { limit: 200 } });
      if (!eventsRes.data.success) {
        setLikedEvents([]);
        setLoading(false);
        return;
      }

      const events = eventsRes.data.data || [];

      // Check liked status for each event in parallel (server supports check endpoint)
      const checks = await Promise.all(
        events.map(async (ev) => {
          try {
            const res = await axios.get(`${API_URL}/events/${ev._id}/check-liked`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.isLiked) return ev;
            return null;
          } catch (err) {
            return null;
          }
        })
      );

      const liked = checks.filter(Boolean);
      setLikedEvents(liked);
    } catch (err) {
      console.error("Fetch liked events error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
    <div className="liked-page">
      <section className="liked-banner">
        <div className="container">
          <h1>Liked event</h1>
        </div>
      </section>

      <div className="container liked-content">
        <h2 className="section-title">Events you liked</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className="liked-cards">
            {likedEvents && likedEvents.length > 0 ? (
              likedEvents.map(ev => <EventCardTest key={ev._id} event={ev} />)
            ) : (
              <div>Bạn chưa thích sự kiện nào</div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default LikedEvent;
