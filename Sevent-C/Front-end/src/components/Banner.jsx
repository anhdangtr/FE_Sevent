import React from "react";
import "./Banner.css";

function Banner({ title, subtitle, imageUrl, buttonText, onButtonClick }) {
  return (
    <section className="banner">
      <div className="banner__content">
        <h1 className="banner__title">{title}</h1>
        <p className="banner__subtitle">{subtitle}</p>
        {buttonText && (
          <button className="banner__button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
      {imageUrl && (
        <div className="banner__image-wrapper">
          <img src={imageUrl} alt="Banner" className="banner__image" />
        </div>
      )}
    </section>
  );
}

export default Banner;
