import React from 'react';
import './CreateInvoice.css';

const CreateInvoice = ({ invoiceData, onBack }) => {
  const { customer, cartItems, subtotal, gst, total, hasGST, invoice } = invoiceData;

  const displayInvoice = invoice || invoiceData;

  return (
    <div className="ci-page">
      <div className="ci-header">
        <h1 className="ci-billing-title">Invoice</h1>
        <button className="btn btn-secondary" onClick={onBack}>Back to Billing</button>
      </div>

      <div className="ci-section">
        <div className="ci-section-header">
          <span className="ci-section-label">Customer Details</span>
          {displayInvoice.invoice_id && (
            <span className="ci-invoice-id">Invoice ID: {displayInvoice.invoice_id}</span>
          )}
        </div>

        <div className="ci-customer-body">
          <div className="ci-info-row">
            <span className="ci-info-key">Customer ID</span>
            <span className="ci-info-colon">:</span>
            <span>{customer.cust_id}</span>
          </div>
          <div className="ci-info-row">
            <span className="ci-info-key">Name</span>
            <span className="ci-info-colon">:</span>
            <strong>{customer.name}</strong>
          </div>
          <div className="ci-info-row">
            <span className="ci-info-key">Address</span>
            <span className="ci-info-colon">:</span>
            <span>{customer.address || 'N/A'}</span>
          </div>
          <div className="ci-info-row">
            <span className="ci-info-key">PAN Number</span>
            <span className="ci-info-colon">:</span>
            <span>{customer.pan_number || 'N/A'}</span>
          </div>
          <div className="ci-info-row">
            <span className="ci-info-key">GST Number</span>
            <span className="ci-info-colon">:</span>
            <span>
              {customer.gst_number || 
                <span className="ci-gst-warning">Not Provided (18% GST Applied)</span>
              }
            </span>
          </div>
          <div className="ci-info-row">
            <span className="ci-info-key">Invoice Date</span>
            <span className="ci-info-colon">:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="ci-section">
        <div className="ci-section-header">
          <span className="ci-section-label">Items Details</span>
        </div>
        <div className="ci-items-body">
          <table className="ci-table">
            <thead>
              <tr>
                <th className="ci-th ci-th-left">Item Code</th>
                <th className="ci-th ci-th-left">Item Name</th>
                <th className="ci-th ci-th-center">Quantity</th>
                <th className="ci-th ci-th-right">Unit Price (₹)</th>
                <th className="ci-th ci-th-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id} className="ci-tr">
                  <td className="ci-td">{item.item_code}</td>
                  <td className="ci-td">{item.name}</td>
                  <td className="ci-td ci-td-center">{item.quantity}</td>
                  <td className="ci-td ci-td-right">{item.selling_price.toLocaleString('en-IN')}</td>
                  <td className="ci-td ci-td-right">{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="ci-tr">
                <td colSpan="4" className="ci-td ci-td-right"><strong>Subtotal</strong></td>
                <td className="ci-td ci-td-right">{subtotal.toLocaleString('en-IN')}</td>
              </tr>
              {hasGST && (
                <tr className="ci-tr">
                  <td colSpan="4" className="ci-td ci-td-right"><strong>GST (18%)</strong></td>
                  <td className="ci-td ci-td-right">{gst.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr className="ci-tr ci-total-row">
                <td colSpan="4" className="ci-td ci-td-right"><strong>Total Amount</strong></td>
                <td className="ci-td ci-td-right">
                  <strong>₹{total.toLocaleString('en-IN')}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="ci-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          New Invoice
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;