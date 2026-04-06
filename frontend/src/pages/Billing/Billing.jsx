import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SelectCustomer from './SelectCustomer';
import AddItem from './AddItem';
import CreateInvoice from './CreateInvoice';
import './Billing.css';

const Billing = () => {
  const [customer, setCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddItem = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.selling_price }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, total: item.selling_price }];
    });
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      setCartItems(prev => prev.filter(i => i.id !== id));
      return;
    }
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: qty, total: qty * i.selling_price } : i)
    );
  };

  const subtotal = cartItems.reduce((s, i) => s + i.total, 0);
  const hasGST = customer && !customer.gst_number;
  const gst = hasGST ? subtotal * 0.18 : 0;
  const total = subtotal + gst;

  const handleCreate = async () => {
    if (!customer) { 
      toast.error('Please select a customer'); 
      return; 
    }
    if (!cartItems.length) { 
      toast.error('Please add items to cart'); 
      return; 
    }

    setLoading(true);

    try {
      const payload = {
        customer_id: customer.id,  
        items: cartItems.map(item => ({
          item_id: item.id,        
          quantity: item.quantity
        }))
      };

      const response = await axios.post('/api/invoices/', payload);

      if (response.data.success) {
        const createdInvoice = response.data.data;
        
        setInvoiceData({ 
          customer, 
          cartItems, 
          subtotal, 
          gst, 
          total, 
          hasGST,
          invoice: createdInvoice  
        });
        setShowInvoice(true);
        toast.success(response.data.message || 'Invoice created successfully');
        
        setCartItems([]);
        setCustomer(null);
      } else {
        toast.error(response.data.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Create invoice error:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Failed to create invoice');
      } else {
        toast.error('Failed to create invoice');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCustomer(null);
    setCartItems([]);
    setInvoiceData(null);
    setShowInvoice(false);
  };

  if (showInvoice && invoiceData) {
    return (
      <CreateInvoice
        invoiceData={invoiceData}
        onBack={handleCancel}
      />
    );
  }

  return (
    <div className="billing-page">
      <h1 className="billing-title">Billing</h1>

      <div className="billing-section">
        <div className="section-header">
          <span className="section-label">Customer Details</span>
          {customer && (
            <button className="btn btn-secondary" onClick={handleCancel}>Clear</button>
          )}
        </div>
        <div className="section-body">
          {customer ? (
            <div className="customer-info">
              <div className="info-row">
                <span className="info-key">Customer ID</span>
                <span className="info-colon">:</span>
                <strong>{customer.cust_id}</strong>
              </div>
              <div className="info-row">
                <span className="info-key">Name</span>
                <span className="info-colon">:</span>
                <strong>{customer.name}</strong>
              </div>
              <div className="info-row">
                <span className="info-key">Address</span>
                <span className="info-colon">:</span>
                <span>{customer.address || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-key">PAN Number</span>
                <span className="info-colon">:</span>
                <span>{customer.pan_number || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-key">GST Number</span>
                <span className="info-colon">:</span>
                <span>
                  {customer.gst_number || 
                    <span className="gst-warning">Not Provided (18% GST will be applied)</span>
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="centered">
              <button className="btn btn-primary" onClick={() => setShowCustomerModal(true)}>
                <span className="plus-circle">+</span> SELECT CUSTOMER
              </button>
            </div>
          )}
        </div>
      </div>

      {customer && (
        <div className="billing-section">
          <div className="section-header">
            <span className="section-label">Items</span>
          </div>
          <div className="section-body">
            {cartItems.length === 0 ? (
              <div className="centered">
                <button className="btn btn-primary" onClick={() => setShowItemModal(true)}>
                  <span className="plus-circle">+</span> ADD ITEMS
                </button>
              </div>
            ) : (
              <>
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th className="th-left">Item Code</th>
                      <th className="th-left">Name</th>
                      <th className="th-center">Quantity</th>
                      <th className="th-right">Price (₹)</th>
                      <th className="th-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="table-row">
                        <td className="td">{item.item_code}</td>
                        <td className="td">{item.name}</td>
                        <td className="td td-center">
                          <div className="qty-row">
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span className="qty-num">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </td>
                        <td className="td td-right">{item.selling_price.toLocaleString('en-IN')}</td>
                        <td className="td td-right">{item.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="td td-right"><strong>Subtotal</strong></td>
                      <td className="td td-right">{subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    {hasGST && (
                      <tr>
                        <td colSpan="4" className="td td-right"><strong>GST (18%)</strong></td>
                        <td className="td td-right">{gst.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="4" className="td td-right"><strong>Total</strong></td>
                      <td className="td td-right"><strong>{total.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <div className="action-row">
                  <button className="btn btn-primary" onClick={() => setShowItemModal(true)}>
                    <span className="plus-circle">+</span> ADD MORE
                  </button>
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="footer-row">
              <button className="btn btn-secondary" onClick={handleCancel}>Clear All</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          )}
        </div>
      )}

      <SelectCustomer
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelect={(c) => {
          setCustomer(c);
          toast.success(`${c.name} selected`);
          setShowCustomerModal(false);
        }}
      />
      <AddItem
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onAdd={(item) => {
          handleAddItem(item);
          setShowItemModal(false);
          toast.success(`${item.name} added to cart`);
        }}
      />
    </div>
  );
};

export default Billing;