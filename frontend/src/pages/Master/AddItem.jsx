import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddItem.css';

const AddItem = ({ onSuccess, onClose }) => {

  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',  
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/items/', {
        name: formData.name,
        selling_price: parseFloat(formData.selling_price), 
        status: formData.status
      });
      
      toast.success('Item added successfully');

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error) {
      console.error('Add item error:', error);
      toast.error('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">

      <h2>Add New Item</h2>

      <div className="form-grid">

        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter item name"
          />
        </div>

        
        <div className="form-group">
          <label>Selling Price</label>  
          <input
            type="number"
            name="selling_price"  
            value={formData.selling_price}
            onChange={handleInputChange}
            required
            step="0.01"  
            placeholder="Enter selling price"
          />
        </div>

        <div className="form-group">
          <label>Status</label>  
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="In-Active">In-Active</option>  
          </select>
        </div>

      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>

    </form>
  );
};

export default AddItem;