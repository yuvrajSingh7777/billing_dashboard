import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddItem.css';

const AddItem = ({ isOpen, onClose, onAdd }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({}); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      setSelected({});
    }
  }, [isOpen]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://billing-dashboard-ztjc.onrender.com/api/items/');
      const itemsData = response.data.data || [];
      
      const activeItems = itemsData.filter(item => item.status === 'Active');
      setItems(activeItems);
    } catch (error) {
      console.error('Fetch items error:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleAddOne = (item) => {
    setSelected(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const increment = (id) => {
    setSelected(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrement = (id) => {
    setSelected(prev => {
      const qty = (prev[id] || 1) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  };

  const handleConfirm = () => {
    const hasSelection = Object.keys(selected).length > 0;
    if (!hasSelection) {
      toast.error('Please select at least one item');
      return;
    }
    
    items.forEach(item => {
      const qty = selected[item.id];
      if (qty) {
        onAdd({
          id: item.id,
          item_code: item.item_code,  
          name: item.name,
          selling_price: parseFloat(item.selling_price),  
          quantity: qty,
          total: parseFloat(item.selling_price) * qty,
        });
      }
    });
    
    toast.success('Items added to bill');
    onClose();
  };

  return (
    <div className="ai-overlay">
      <div className="ai-modal">
        <div className="ai-header">
          <h2 className="ai-title">Select Items</h2>
        </div>

        <div className="ai-grid">
          {loading ? (
            <div className="ai-loading">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="ai-empty">No active items found</div>
          ) : (
            items.map(item => {
              const isActive = item.status === 'Active';
              const qty = selected[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`ai-card ${!isActive ? 'ai-card--inactive' : ''}`}
                >
                  <div className="ai-card-info">
                    <span className="ai-card-name">{item.name}</span>
                  </div>

                  {!isActive ? (
                    <span className="ai-badge ai-badge--inactive">{item.status}</span>
                  ) : qty > 0 ? (
                    <div className="ai-qty-row">
                      <button className="ai-qty-btn" onClick={() => decrement(item.id)}>-</button>
                      <span className="ai-qty-num">{qty}</span>
                      <button className="ai-qty-btn" onClick={() => increment(item.id)}>+</button>
                    </div>
                  ) : (
                    <button className="ai-add-small-btn" onClick={() => handleAddOne(item)}>ADD</button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="ai-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>ADD TO BILL</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
