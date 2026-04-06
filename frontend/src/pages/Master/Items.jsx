import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal';
import AddItem from './AddItem'; 
import './Items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items/');
      
      const itemsData = res.data.data || [];
      
      setItems(itemsData);
      setFilteredItems(itemsData);
    } catch (error) {
      console.error('Fetch items error:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.item_code && item.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="items-page">
      <div className="container">

        <div className="page-header">
          <h1>Items Master</h1>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'white',
              color: '#2563eb',
              border: '1px solid #2563eb',
              borderRadius: '10px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <FaPlus /> Add Item
          </button>
        </div>

        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or item code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              
              <h3 className="item-name">{item.name}</h3>
              
              <span className={`status-badge ${
                item.status === 'Active' ? 'active' : 'inactive'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-results">
            <p>No items found</p>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add Item"
        >
          <AddItem
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchItems();
            }}
          />
        </Modal>

      </div>
    </div>
  );
};

export default Items;