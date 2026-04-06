import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ViewInvoices from './ViewInvoices';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        
        <ViewInvoices />

        
      </div>
    </div>
  );
};

export default Dashboard;