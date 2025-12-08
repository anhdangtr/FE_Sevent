import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReminderModal.css';
import TimeRollPicker from './TimeRollPicker';

const ReminderModal = ({ eventId, eventTitle, isOpen, onClose, API_URL, token }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [reminders, setReminders] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const MAX_REMINDERS = 3;

  useEffect(() => {
    if (isOpen) {
      fetchReminders();
      setSelectedDate(null);
      setSelectedTime('09:00');
      setNote('');
      setError('');
    }
  }, [isOpen]);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reminders/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(res.data.data || []);
    } catch (err) {
      console.error('Fetch reminders error:', err);
      setReminders([]);
    }
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) return;

    setSelectedDate(selected);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSetReminder = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Vui lòng chọn ngày và giờ');
      return;
    }

    if (reminders.length >= MAX_REMINDERS) {
      setError(`Chỉ được đặt tối đa ${MAX_REMINDERS} reminder`);
      return;
    }

    const reminderDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    reminderDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (reminderDateTime <= new Date()) {
      setError('Vui lòng chọn thời gian trong tương lai');
      return;
    }

    const isDuplicate = reminders.some(r => {
      const rDate = new Date(r.reminderDateTime);
      return rDate.getTime() === reminderDateTime.getTime();
    });

    if (isDuplicate) {
      setError('Thời gian reminder này đã tồn tại');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/reminders`, {
        eventId,
        reminderDateTime,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchReminders();
      setSelectedDate(null);
      setSelectedTime('09:00');
      setNote('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đặt reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await axios.delete(`${API_URL}/api/reminders/${reminderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReminders();
    } catch (err) {
      console.error('Delete reminder error:', err);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      const isPast = date < today;

      days.push(
        <button
          key={i}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
          onClick={() => !isPast && handleDateSelect(i)}
          disabled={isPast}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const formatReminderTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="reminder-modal-overlay">
      <div className="reminder-modal">
        <div className="reminder-modal-content">

          {/* LEFT SIDE */}
          <div className="reminder-left-panel">
            <div className="reminder-event-title">{eventTitle}</div>

            <div className="reminder-list-container">
              <h3>Reminders đã đặt</h3>

              {reminders.length === 0 ? (
                <p className="no-reminders">Chưa có reminder nào</p>
              ) : (
                <ul className="reminders-list">
                  {reminders.map(r => (
                    <li key={r._id} className="reminder-item">
                      <div className="reminder-item-time">{formatReminderTime(r.reminderDateTime)}</div>

                      {r.note && (
                        <div className="reminder-item-note">{r.note}</div>
                      )}

                      <button
                        className="reminder-delete-btn"
                        onClick={() => handleDeleteReminder(r._id)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="reminder-note-box">
              <label>Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thêm ghi chú..."
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="reminder-right-panel">
            <h3>Chọn ngày & giờ</h3>

            <div className="calendar-header">
              <button onClick={handlePrevMonth}>&lt;</button>
              <span>{currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className="calendar-weekdays">
              <div>CN</div><div>T2</div><div>T3</div><div>T4</div>
              <div>T5</div><div>T6</div><div>T7</div>
            </div>

            <div className="calendar-days">
              {renderCalendar()}
            </div>

            <div className="time-picker-container">
              <label>Giờ</label>
              <TimeRollPicker value={selectedTime} onChange={(v) => setSelectedTime(v)} />
            </div>

            {selectedDate && (
              <div className="selected-datetime">
                {selectedDate.toLocaleDateString('vi-VN')} lúc {selectedTime}
              </div>
            )}
          </div>
        </div>

        {error && <div className="reminder-error">{error}</div>}

        <div className="reminder-modal-footer">
          <button className="reminder-back-btn" onClick={onClose}>← Trở về</button>
          <button
            className="reminder-set-btn"
            onClick={handleSetReminder}
            disabled={loading || reminders.length >= MAX_REMINDERS}
          >
            {loading ? 'Đang lưu...' : 'Đặt Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
