
// src/pages/Contact.jsx  (or wherever you put pages)
import React from "react";
import "./Contact.css";
import { FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Contact() {
  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
      {/* Hero Header */}
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Có thắc mắc, góp ý hay chỉ muốn nói "Hi"? </p>
        <p>  Chúng mình luôn sẵn sàng nghe đây!</p>
      </div>

      <div className="contact-content">
        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          <div className="info-card">
            <div className="icon-circle">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>23520038@gm.uit.edu.vn</p>
            <p>23521842@gm.uit.edu.vn</p>
          </div>

          <div className="info-card">
            <div className="icon-circle">
              <FaFacebookF />
            </div>
            <h3>Facebook</h3>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Đặng Trung Anh
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Đỗ Thị Như Ý
            </a>
          </div>

          <div className="info-card">
            <div className="icon-circle">
              <FaMapMarkerAlt />
            </div>
            <h3>Địa chỉ</h3>
            <p>Đại học Công nghệ Thông tin</p>
            <p>Khu phố 6, P.Linh Trung, TP.Thủ Đức</p>
            <p>TP. Hồ Chí Minh</p>
            <a href="https://www.google.com/maps/place/Ho+Chi+Minh+City+University+of+Technology/@10.8719,106.8043,15z" target="_blank" rel="noopener noreferrer" className="map-link">
              📍 Xem trên Google Maps
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Gửi tin nhắn cho chúng mình</h2>
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Họ và tên" required />
              <input type="email" placeholder="Email của bạn" required />
            </div>
            <input type="text" placeholder="Tiêu đề" required />
            <textarea rows="6" placeholder="Nội dung tin nhắn..." required></textarea>
            <button type="submit" className="submit-btn">
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>

  );
}

export default Contact;