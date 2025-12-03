import React, { useState, useEffect } from "react";
import "./TimeRollPicker.css";

export default function TimeRollPicker({ value, onChange }) {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  const hours = [...Array(24).keys()].map((h) => String(h).padStart(2, "0"));
  const minutes = [...Array(60).keys()].map((m) => String(m).padStart(2, "0"));

  const handleHourChange = (e) => {
    const h = e.target.value;
    setHour(h);
    onChange(`${h}:${minute}`);
  };

  const handleMinuteChange = (e) => {
    const m = e.target.value;
    setMinute(m);
    onChange(`${hour}:${m}`);
  };

  return (
    <div className="time-roll-container">
      <select className="time-roll" value={hour} onChange={handleHourChange}>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <span className="time-separator">:</span>

      <select className="time-roll" value={minute} onChange={handleMinuteChange}>
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
