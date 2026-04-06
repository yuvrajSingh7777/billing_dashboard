import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import ViewInvoices from './pages/Dashboard/ViewInvoices';
import Master from './pages/Master/Master';
import Customers from './pages/Master/Customers';
import Items from './pages/Master/Items';
import AddCustomer from './pages/Master/AddCustomer';
import AddItem from './pages/Master/AddItem';
import Billing from './pages/Billing/Billing';
import CreateInvoice from './pages/Billing/CreateInvoice';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view-invoices" element={<ViewInvoices />} />
            <Route path="/master" element={<Master />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/items" element={<Items />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;