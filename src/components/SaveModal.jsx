import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SaveModal.css';

const SaveModal = ({ eventId, isOpen, onClose, API_URL, token, onSaveSuccess }) => {
  const [selectedFolder, setSelectedFolder] = useState('Watch later');
  const [folders, setFolders] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch danh sách folder khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  //Lấy danh sách folder từ backend
  const fetchFolders = async () => {
    try {
      setFolderLoading(true);
      const response = await axios.get(`${API_URL}/api/saved-events/get-folders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFolders(response.data.folders || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách folder:', err);
      setFolders([]);
    } finally {
      setFolderLoading(false);
    }
  };

  // Tạo folder mới
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      setError("Vui lòng nhập tên folder");
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/saved-events/post-folders`,
        { folderName: newFolderName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.folder;
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo folder");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const folderToSave = isCreatingNew ? newFolderName.trim() : selectedFolder;

    if (!folderToSave) {
      setError('Vui lòng chọn hoặc nhập tên folder');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        eventId,
        folderName: folderToSave
      };

      const response = await axios.post(`${API_URL}/api/saved-events`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Lưu event thành công!');

      // Trigger parent callback so it can update UI (button color, counters)
      try {
        if (onSaveSuccess) {
          // Let parent increment its saveCount optimistically (no count returned here)
          onSaveSuccess();
        }
      } catch (e) {
        console.warn('onSaveSuccess callback error', e);
      }

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFolder('Watch later');
    setIsCreatingNew(false);
    setNewFolderName('');
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
          <label>Chọn Folder</label>
          
          {!isCreatingNew ? (
            <>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="save-folder-select"
                disabled={folderLoading}
              >
                <option value="Watch later"> Watch later</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.name}>
                    📁 {folder.name}
                  </option>
                ))}
              </select>
              
              <button
                className="save-create-new-btn"
                onClick={() => setIsCreatingNew(true)}
              >
                + Tạo folder mới
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nhập tên folder mới..."
                className="save-folder-input"
                autoFocus
              />
              <div className="save-new-folder-actions">
                <button
                  className="save-new-folder-confirm"
                  onClick={async () => {
                    const created = await createFolder();
                    if (created) {
                      await fetchFolders();
                      setSelectedFolder(created.name);
                      setIsCreatingNew(false);
                      setNewFolderName('');
                    }
                  }}
                >
                  Xong
                </button>
                <button
                  className="save-new-folder-cancel"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewFolderName('');
                  }}
                >
                  Huỷ
                </button>
              </div>
            </>
          )}
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