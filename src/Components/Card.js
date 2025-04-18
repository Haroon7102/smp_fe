import React from 'react';
import './Card.css';

const Card = ({ title, description, image }) => {
    return (
        <div className="card">
            <img src={image} alt={title} className="card-img" />
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

export default Card;
