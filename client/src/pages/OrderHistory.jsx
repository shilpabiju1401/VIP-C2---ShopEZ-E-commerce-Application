import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setToastMessage('Failed to load orders history');
        setToastType('danger');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-glow-success';
      case 'Pending':
        return 'badge-glow-warning';
      case 'Confirmed':
      case 'Shipped':
        return 'bg-info bg-opacity-15 text-info border border-info border-opacity-30';
      case 'Cancelled':
        return 'badge-glow-danger';
      default:
        return 'bg-secondary bg-opacity-20 text-muted';
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="card glass-card p-5 col-lg-6 mx-auto">
          <i className="bi bi-receipt-cutoff fs-1 d-block mb-3 text-secondary"></i>
          <h3 className="text-white font-heading">No Orders Placed</h3>
          <p className="small mb-4">You haven't placed any orders yet. Check out our catalog to place your first order!</p>
          <Link to="/products" className="btn btn-primary-glow rounded-pill px-4">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 text-white">
      <h2 className="text-white font-heading mb-4">Order History</h2>

      <div className="d-flex flex-column gap-4">
        {orders.map((order) => (
          <div key={order._id} className="card glass-card p-4">
            
            {/* Card Header: Order summary */}
            <div className="row g-3 justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
              <div className="col-md-7 col-12">
                <span className="text-muted small d-block">Order Reference:</span>
                <span className="text-white fw-bold font-heading small">{order._id}</span>
                <span className="text-muted small ms-md-3 mt-1 mt-md-0 d-inline-block">
                  Placed: {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="col-md-5 col-12 text-md-end d-flex gap-2 justify-content-md-end align-items-center">
                <span className={`badge ${getStatusClass(order.orderStatus)} px-3 py-2 rounded-pill small`}>
                  Status: {order.orderStatus}
                </span>
                <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-glow-success' : 'badge-glow-warning'} px-3 py-2 rounded-pill small`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Card Body: Products listing */}
            <div className="d-flex flex-column gap-3 mb-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center small">
                  <div>
                    <span className="text-white fw-bold">{item.quantity}x</span> {item.title}
                    {item.size && <span className="text-muted ms-2 small">({item.size})</span>}
                  </div>
                  <span className="text-gradient fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Card Footer: Address details */}
            <div className="row mt-3 pt-3 border-top border-secondary border-opacity-10 justify-content-between align-items-center g-3">
              <div className="col-md-8 col-12 text-muted small">
                <i className="bi bi-geo-alt me-1"></i> Delivered to: <span className="text-white">{order.customerName}</span> — {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}
              </div>
              <div className="col-md-4 col-12 text-md-end text-gradient font-heading fs-5 fw-extrabold">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Floating notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default OrderHistory;
