import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal';
import './ViewInvoices.css';

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, invoices]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('https://billing-dashboard-ztjc.onrender.com/api/invoices/');
      
      const invoicesData = response.data.data || [];
      
      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
    } catch (error) {
      console.error('Fetch invoices error:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(invoice =>
        invoice.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.item_names && invoice.item_names.some(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredInvoices(filtered);
    }
  };

  const viewInvoiceDetails = async (invoiceId) => {
    try {
      const response = await axios.get(`https://billing-dashboard-ztjc.onrender.com/api/invoices/${invoiceId}`);
      
      const invoiceData = response.data.data;
      
      setSelectedInvoice(invoiceData);
      setShowModal(true);
    } catch (error) {
      console.error('Fetch invoice details error:', error);
      toast.error('Failed to fetch invoice details');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-invoices">
      <div className="container">
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Invoices</h1>
        <div className="page-header">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Invoice ID, Customer Name, or Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="invoices-table-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer Name</th>
                <th>Item Name(s)</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.invoice_id}</td>
                  <td>{invoice.customer_name}</td>
                  
                  <td className="item-names-cell">
                    <div className="item-names-list">
                      {invoice.item_names && invoice.item_names.length > 0 ? (
                        invoice.item_names.map((item, idx) => (
                          <span key={idx} className="item-name-badge">
                            {item}{idx !== invoice.item_names.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      ) : (
                        'No items'
                      )}
                    </div>
                   </td>
                  <td>₹{parseFloat(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => viewInvoiceDetails(invoice.invoice_id)}
                    >
                      View
                    </button>
                   </td>
                 </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Invoice Details"
        >
          {selectedInvoice && (
            <div className="invoice-details-modal">
              <div className="invoice-info">
                <p><strong>Invoice ID:</strong> {selectedInvoice.invoice_id}</p>
                <p><strong>Customer:</strong> {selectedInvoice.customer_name}</p>
                <p><strong>Customer Address:</strong> {selectedInvoice.customer_address}</p>
                <p><strong>PAN Number:</strong> {selectedInvoice.customer_pan}</p>
                <p>
                  <strong>GST Number:</strong> 
                  {selectedInvoice.customer_gst ? (
                    ` ${selectedInvoice.customer_gst}`
                  ) : (
                    <span className="gst-absent"> Not Provided (18% GST Applied)</span>
                  )}
                </p>
                <p><strong>Invoice Date:</strong> {new Date(selectedInvoice.created_at).toLocaleDateString()}</p>
              </div>

              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price (₹)</th>
                    <th>Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item_code}</td>
                      <td>{item.item_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{parseFloat(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>₹{parseFloat(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="totals">
                <p>Subtotal: ₹{parseFloat(selectedInvoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <p>GST Rate: {selectedInvoice.gst_rate}%</p>
                <p>GST Amount: ₹{parseFloat(selectedInvoice.gst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <h3>Total: ₹{parseFloat(selectedInvoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ViewInvoices;
