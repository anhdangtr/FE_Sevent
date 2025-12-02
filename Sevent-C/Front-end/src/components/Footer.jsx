import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>S-Event © {new Date().getFullYear()}. All rights reserved.</p>
        <ul className="footer__links">
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
