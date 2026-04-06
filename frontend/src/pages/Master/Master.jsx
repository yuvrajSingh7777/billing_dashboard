import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBox, FaPlus } from 'react-icons/fa';
import './Master.css';

const Master = () => {
  const navigate = useNavigate();

  const masterCards = [
    {
      title: 'Customers',
      description: 'Manage customer master data. Add, edit, or delete customer information.',
      icon: <FaUsers />,
      color: '#667eea',
      path: '/customers',
      bgColor: 'linear-gradient(135deg, #ddb551 0%, #e79d61 100%)'
    },
    {
      title: 'Items',
      description: 'Manage item master data. Add, edit, or delete product information.',
      icon: <FaBox />,
      color: '#48bb78',
      path: '/items',
      bgColor: 'linear-gradient(135deg, #5fbc86 0%, #1fa05b 100%)'
    }
  ];

  return (
    <div className="master">
      <div className="container">
        <div className="master-header">
          <h1>Master Management</h1>
        </div>
        
        <div className="master-cards">
          {masterCards.map((card, index) => (
            <div
              key={index}
              className="master-card"
              onClick={() => navigate(card.path)}
              style={{ background: card.bgColor }}
            >
              <div className="master-card-icon">
                {card.icon}
              </div>
              <div className="master-card-content">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <button className="master-card-btn">
                  <FaPlus />  Add {card.title} 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Master;
