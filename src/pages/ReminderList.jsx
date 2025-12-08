import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCardTest from "../components/EventCardTest";
import "./ReminderList.css";
import Navbar from "../components/Navbar";

const ReminderList = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [items, setItems] = useState([]); // { event, reminders: [] }
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    fetchRemindersAcrossEvents();
  }, []);

  const fetchRemindersAcrossEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Fetch many events (limit to 200 to avoid huge requests)
      const eventsRes = await axios.get(`${API_URL}/api/events`, { params: { limit: 200 } });
      if (!eventsRes.data.success) {
        setItems([]);
        setLoading(false);
        return;
      }

      const events = eventsRes.data.data || [];

      // For each event, request reminders for that event (returns user's reminders for that event)
      const checks = await Promise.all(
        events.map(async (ev) => {
          try {
            const res = await axios.get(`${API_URL}/api/reminders/${ev._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data && res.data.data.length > 0) {
              return { event: ev, reminders: res.data.data };
            }
            return null;
          } catch (err) {
            return null;
          }
        })
      );

      const filtered = checks.filter(Boolean);
      setItems(filtered);
    } catch (err) {
      console.error("Fetch reminders error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />    
    <div className="reminder-page">
      <section className="reminder-banner">
        <div className="container">
          <h1>Reminders</h1>
        </div>
      </section>

      <div className="container reminder-content">
        <h2 className="section-title">Reminders bạn đã đặt</h2>

        {loading ? (
          <div>Đang tải...</div>
        ) : items.length === 0 ? (
          <div>Bạn chưa đặt reminder nào</div>
        ) : (
          <div className="reminder-list">
            {items.map(({ event, reminders }) => (
              <div key={event._id} className="reminder-item">
                <EventCardTest event={event} />
                <div className="reminder-details">
                  <h4>Reminder(s)</h4>
                  <ul>
                    {reminders.map(r => (
                      <li key={r._id}>
                        {new Date(r.reminderDateTime).toLocaleString('vi-VN')} {r.note ? `- ${r.note}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ReminderList;
