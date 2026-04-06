import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddCustomer.css';

const AddCustomer = ({ onSuccess, onClose }) => {

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pan_number: '',
    gst_number: '',
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
      const payload = {
        name: formData.name,
        address: formData.address,
        pan_number: formData.pan_number,
        gst_number: formData.gst_number || null,
        status: formData.status
      };

      await axios.post('/api/customers/', payload);

      toast.success('Customer added successfully');

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error) {
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>Customer Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>Customer PAN Number</label>
            <input
              type="text"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleInputChange}
              required
              placeholder="Enter PAN"
            />
          </div>

          <div className="form-group">
            <label>Customer GST Number</label>
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleInputChange}
              placeholder="Enter GST"
            />
          </div>

          <div className="form-group">
            <label>Customer Status</label>
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
    </div>
  );
};

export default AddCustomer;