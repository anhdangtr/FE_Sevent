import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SaveModal.css";

const SaveModal = ({ eventId, isOpen, onClose, API_URL, token }) => {
  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Folder xem nhiều → phần "Các lựa chọn hay nhất"
  const [topFolders, setTopFolders] = useState([]);

  // Tạo bảng mới
  const [creating, setCreating] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetchFolders();
  }, [isOpen]);

  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${API_URL}/saved-events/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data.folders || [];
      setFolders(list);
      setTopFolders(list.slice(0, 2)); // giả lập best choice
    } catch (e) {
      console.log("Error loading folders");
    }
  };

  const handleSave = async (folderName) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/saved-events`,
        { eventId, folderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
    } catch (e) {
      console.log("Save error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolder.trim()) return;

    await handleSave(newFolder.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="save-overlay">
      <div className="save-box">
        <div className="save-header">
          <h2>Lưu</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="folder-scroll">

          {/* TOP FOLDERS */}
          <div className="section-title">Các lựa chọn hay nhất</div>
          {topFolders.map((f, i) => (
            <div key={i} className="folder-item" onClick={() => handleSave(f)}>
              <div className="folder-thumb"></div>
              <div className="folder-name">{f}</div>
            </div>
          ))}

          {/* ALL FOLDERS */}
          <div className="section-title">Tất cả các bảng</div>
          {folders
            .filter((f) => f.toLowerCase().includes(search.toLowerCase()))
            .map((f, i) => (
              <div key={i} className="folder-item" onClick={() => handleSave(f)}>
                <div className="folder-thumb"></div>
                <div className="folder-name">{f}</div>
              </div>
            ))}
        </div>

        {/* CREATE FOLDER BUTTON */}
        {!creating ? (
          <div className="create-btn" onClick={() => setCreating(true)}>
            <span className="plus-icon">＋</span> Tạo bảng
          </div>
        ) : (
          <div className="create-box">
            <input
              type="text"
              placeholder="Tên bảng"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
            />
            <button className="submit-btn" onClick={handleCreateFolder}>
              Tạo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveModal;
