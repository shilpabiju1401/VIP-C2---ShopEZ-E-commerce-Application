import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Change States
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load orders history');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setUpdatingOrderId(order._id);
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!updatingOrderId) return;

    try {
      await api.put(`/orders/${updatingOrderId}`, { orderStatus, paymentStatus });
      setToastMessage('Order status updated successfully!');
      setToastType('success');
      setUpdatingOrderId(null);
      fetchAllOrders();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to update order');
      setToastType('danger');
    }
  };

  const getOrderStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-glow-success';
      case 'Pending':
        return 'badge-glow-warning';
      case 'Confirmed':
      case 'Shipped':
        return 'bg-info bg-opacity-15 text-info border border-info border-opacity-20';
      case 'Cancelled':
        return 'badge-glow-danger';
      default:
        return 'bg-secondary bg-opacity-20 text-muted';
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="text-white font-heading mb-1">Manage Orders</h3>
        <p className="text-muted small">Monitor, update delivery steps, and flag payment status</p>
      </div>

      {/* Orders Grid Table */}
      <div className="card glass-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-muted small mb-0">No client orders placed yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 small">
              <thead>
                <tr className="border-secondary border-opacity-10 text-muted">
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Order Date</th>
                  <th>Total Pay</th>
                  <th>Payment Type</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-secondary border-opacity-10">
                    <td className="fw-bold">{order._id.substring(0, 10)}...</td>
                    <td>
                      <div className="fw-semibold text-white">{order.customerName}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{order.email}</div>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="fw-bold text-gradient">${order.totalAmount.toFixed(2)}</td>
                    <td className="text-muted">{order.paymentMethod}</td>
                    <td>
                      <span className={`badge rounded-pill ${getOrderStatusBadgeClass(order.orderStatus)} px-2 py-1`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${order.paymentStatus === 'Paid' ? 'badge-glow-success' : 'badge-glow-warning'} px-2 py-1`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="btn btn-sm btn-outline-glass px-3"
                      >
                        Adjust Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Status Modal */}
      {updatingOrderId && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-heading text-white">Adjust Order Status</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setUpdatingOrderId(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="modal-body d-flex flex-column gap-3 text-start">
                  
                  {/* Order Status Select */}
                  <div>
                    <label className="form-label text-muted small">Order Status</label>
                    <select
                      className="form-select"
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status Select */}
                  <div>
                    <label className="form-label text-muted small">Payment Status</label>
                    <select
                      className="form-select"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-glass"
                    onClick={() => setUpdatingOrderId(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-glow px-4">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default OrderManage;
