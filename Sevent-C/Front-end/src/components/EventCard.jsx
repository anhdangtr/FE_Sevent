import React from "react";
import "./EventCard.css";

function EventCard({ image, title, date, location, description, onClick }) {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-card__image-wrapper">
        <img src={image} alt={title} className="event-card__image" />
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{title}</h3>
        <p className="event-card__date">{date}</p>
        <p className="event-card__location">{location}</p>
        <p className="event-card__description">{description}</p>
      </div>
    </div>
  );
}

export default EventCard;
