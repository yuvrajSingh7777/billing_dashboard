import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, color, onClick }) => {
  return (
    <div className="stats-card" style={{ borderTopColor: color }} onClick={onClick}>
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: color }}>
          {icon}
        </div>
        <h3>{title}</h3>
      </div>
      <div className="stats-card-value">{value}</div>
    </div>
  );
};

export default Card;