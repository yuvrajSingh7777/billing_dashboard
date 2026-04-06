import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './SelectCustomer.css';

const SelectCustomer = ({ isOpen, onClose, onSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://billing-dashboard-ztjc.onrender.com/api/customers/');
      const customersData = response.data.data || [];
      
      const activeCustomers = customersData.filter(c => c.status === 'Active');
      setCustomers(activeCustomers);
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sc-overlay">
      <div className="sc-modal">
        <div className="sc-header">
          <h2 className="sc-title">Select Customer</h2>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>

        <div className="sc-grid">
          {loading ? (
            <div className="sc-loading">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="sc-empty">No active customers found</div>
          ) : (
            customers.map(customer => {
              const isActive = customer.status === 'Active';
              return (
                <div
                  key={customer.id}
                  className={`sc-card ${!isActive ? 'sc-card--inactive' : ''}`}
                  onClick={() => {
                    if (!isActive) return;
                    onSelect(customer);
                    onClose();
                  }}
                >
                  <div className="sc-card-info">
                    <span className="sc-card-name">{customer.name}</span>
                  </div>
                  <span className={isActive ? 'sc-badge sc-badge--active' : 'sc-badge sc-badge--inactive'}>
                    {customer.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCustomer;
