import React, { useState } from 'react';
import axios from 'axios';
import './SaveModal.css';

const SaveModal = ({ eventId, isOpen, onClose, API_URL, token }) => {
  const [folderName, setFolderName] = useState('Watch later');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!folderName.trim()) {
      setError('Vui lòng nhập tên folder');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        eventId,
        folderName: folderName.trim()
      };

      await axios.post(`${API_URL}/saved-events`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Lưu event thành công!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName('Watch later');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      <div className="save-modal">
        <div className="save-modal-header">
          <h2>Lưu Event</h2>
          <button className="save-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="save-modal-body">
          <label htmlFor="folderName">Tên Folder</label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Ví dụ: Sự kiện yêu thích, Tech events..."
            className="save-folder-input"
          />
          <p className="save-info-text">Mặc định là "Watch later" nếu không chỉnh sửa</p>
        </div>

        {error && <div className="save-error">{error}</div>}
        {success && <div className="save-success">{success}</div>}

        <div className="save-modal-footer">
          <button className="save-cancel-btn" onClick={handleClose}>Huỷ</button>
          <button 
            className="save-confirm-btn" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
