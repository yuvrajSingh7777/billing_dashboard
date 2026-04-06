import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal';
import AddCustomer from './AddCustomer';
import './Customers.css';

const Customers = () => {

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers/');
      
      const customersData = response.data.data || [];
      
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.cust_id && customer.cust_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  };

 

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customers-page">
      <div className="container">

        <div className="page-header">
          <div>
            <h1>Customers Master</h1>
          </div>

          <button style={{
            background: 'white',
            color: '#2563eb',
          }}
            className="btn"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Customer
          </button>
        </div>

        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              
              <h3 className="customer-name">{customer.name}</h3>
              
              <span
                className={`status-badge ${customer.status === 'Active' ? 'active' : 'inactive'}`}
              >
                {customer.status}
              </span>

              
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="no-results">
            <p>No customers found</p>
          </div>
        )}

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Customer"
        >
          <AddCustomer
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchCustomers();
            }}
          />
        </Modal>

      </div>
    </div>
  );
};

export default Customers;