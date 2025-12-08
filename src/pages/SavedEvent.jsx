import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCardTest from "../components/EventCardTest";
import "./SavedEvent.css";
import Navbar from "../components/Navbar";

const SavedEvent = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [savedItems, setSavedItems] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [folderEvents, setFolderEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    fetchSaved();
    fetchFolders();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/saved-events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // res.data.data is array of { folder, event, savedAt }
        const all = res.data.data.map(item => item.event);
        // sort by createdAt or savedAt - descending
        setSavedItems(all);
      }
    } catch (err) {
      console.error("Fetch saved error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/saved-events/get-folders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setFolders(res.data.folders);
      }
    } catch (err) {
      console.error("Fetch folders error:", err);
    }
  };

  const openFolder = async (name) => {
    try {
      setActiveFolder(name === activeFolder ? null : name);
      if (name === activeFolder) {
        setFolderEvents([]);
        return;
      }
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/saved-events/folder/${encodeURIComponent(name)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // res.data.events is array of { event, savedAt }
        const evs = res.data.events.map(it => it.event);
        setFolderEvents(evs);
      }
    } catch (err) {
      console.error("Open folder error:", err);
    }
  };

  return (
    <><Navbar activeNav={activeNav} setActiveNav={setActiveNav} /><div className="saved-page">
      <section className="saved-banner">
        <div className="container">
          <h1>Event đã lưu</h1>
        </div>
      </section>

      <div className="container saved-content">
        <h2 className="section-title">Mới lưu gần đây</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className="saved-cards">
            {savedItems && savedItems.length > 0 ? (
              savedItems.slice(0, 4).map(ev => (
                <EventCardTest key={ev._id} event={ev} />
              ))
            ) : (
              <div>Chưa có sự kiện được lưu</div>
            )}
          </div>
        )}

        <div className="folders-section">
          <h3>Thư mục</h3>
          <div className="folder-list">
            {folders && folders.length > 0 ? (
              folders.map(f => (
                <div key={f.name} className="folder-item">
                  <button className="folder-btn" onClick={() => openFolder(f.name)}>
                    <span className="folder-icon">📁</span>
                    <span className="folder-name">{f.name}</span>
                    <span className="folder-count">{f.totalEvents}</span>
                  </button>
                  {activeFolder === f.name && (
                    <div className="folder-events">
                      {folderEvents.length > 0 ? (
                        folderEvents.map(fe => (
                          <EventCardTest key={fe._id} event={fe} />
                        ))
                      ) : (
                        <div>Không có sự kiện trong thư mục này</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>Không có thư mục nào</div>
            )}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default SavedEvent;
