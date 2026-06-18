import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.loading && cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Form State
  const [customerName, setCustomerName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Mock Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !email || !phone || !street || !city || !state || !zipCode || !country) {
      setToastMessage('Please fill in all shipping fields');
      setToastType('warning');
      return;
    }

    if (paymentMethod === 'Card') {
      if (!cardNumber || !expiry || !cvv) {
        setToastMessage('Please fill in mock card fields');
        setToastType('warning');
        return;
      }
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName,
        email,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country
        },
        paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      
      setCreatedOrder(res.data);
      setOrderSuccess(true);
      setToastMessage('Order placed successfully!');
      setToastType('success');
      
      // Clear shopping cart state
      await clearCart();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to place order');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const subtotal = cart.totalPrice;
  const shippingCost = subtotal >= 50.00 ? 0.00 : 5.99;
  const grandTotal = parseFloat((subtotal + shippingCost).toFixed(2));

  // Success view
  if (orderSuccess && createdOrder) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="card glass-card p-5 col-lg-6 mx-auto border-success">
          <i className="bi bi-check2-circle text-success fs-1 mb-3 d-block" style={{ fontSize: '4.5rem' }}></i>
          <h2 className="font-heading mb-2">Order Confirmed!</h2>
          <p className="text-muted small mb-4">
            Thank you, <span className="text-white fw-bold">{createdOrder.customerName}</span>. Your order has been placed successfully.
          </p>
          
          <div className="bg-white bg-opacity-5 p-4 rounded-3 text-start mb-4 border border-secondary border-opacity-10">
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Order ID:</span>
              <span className="text-white fw-bold">{createdOrder._id}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Total Amount:</span>
              <span className="text-gradient fw-extrabold">${createdOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Payment:</span>
              <span className={`badge ${createdOrder.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'} small`}>
                {createdOrder.paymentMethod} - {createdOrder.paymentStatus}
              </span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Shipping Address:</span>
              <span className="text-white text-end">{createdOrder.address.street}, {createdOrder.address.city}</span>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <Link to="/orders" className="btn btn-primary-glow rounded-pill px-4">View Order History</Link>
            <Link to="/" className="btn btn-outline-glass rounded-pill px-4">Back to Store</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 text-white">
      <h2 className="text-white font-heading mb-4">Secure Checkout</h2>

      <form onSubmit={handleSubmit} className="row g-4">
        {/* Left Side: Shipping & Payment Address Form */}
        <div className="col-lg-8">
          <div className="card glass-card p-4 d-flex flex-column gap-4">
            
            {/* Contact details */}
            <div>
              <h5 className="text-white mb-3 font-heading border-bottom border-secondary border-opacity-10 pb-2">1. Contact Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 123-456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h5 className="text-white mb-3 font-heading border-bottom border-secondary border-opacity-10 pb-2">2. Shipping Address</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-muted small">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Apartment, suite, unit, 100 Main St"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 col-6">
                  <label className="form-label text-muted small">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CA"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2 col-6">
                  <label className="form-label text-muted small">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h5 className="text-white mb-3 font-heading border-bottom border-secondary border-opacity-10 pb-2">3. Payment Method</h5>
              
              <div className="d-flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`btn rounded-3 flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 ${paymentMethod === 'COD' ? 'btn-primary-glow' : 'btn-outline-glass'}`}
                >
                  <i className="bi bi-cash-stack fs-5"></i>
                  <span>Cash on Delivery (COD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`btn rounded-3 flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 ${paymentMethod === 'Card' ? 'btn-primary-glow' : 'btn-outline-glass'}`}
                >
                  <i className="bi bi-credit-card-2-front fs-5"></i>
                  <span>Credit / Debit Card</span>
                </button>
              </div>

              {/* Mock Credit Card Sub-form */}
              {paymentMethod === 'Card' && (
                <div
                  className="card p-4 border border-secondary border-opacity-10 bg-white bg-opacity-5 rounded-3 mb-2"
                  style={{ animation: 'fadeIn 0.3s ease-in-out' }}
                >
                  <h6 className="text-white mb-3"><i className="bi bi-shield-lock me-2 text-gradient"></i> Mock Credit Card Details</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength="19"
                      />
                    </div>
                    <div className="col-md-6 col-6">
                      <label className="form-label text-muted small">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength="5"
                      />
                    </div>
                    <div className="col-md-6 col-6">
                      <label className="form-label text-muted small">CVV</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Order summary & placing */}
        <div className="col-lg-4">
          <div className="card glass-card p-4">
            <h4 className="font-heading text-white mb-4">Order Summary</h4>

            {/* Product summary items */}
            <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {cart.items.map((item, idx) => {
                const product = item.productId;
                if (!product) return null;
                const discount = product.discount || 0;
                const price = product.price;
                const finalPrice = price - (price * (discount / 100));

                return (
                  <div key={idx} className="d-flex justify-content-between align-items-center gap-2 small">
                    <div className="text-truncate" style={{ maxWidth: '70%' }}>
                      <span className="text-white fw-bold">{item.quantity}x</span> {product.title}
                      {item.size && <span className="text-muted d-block small">Size: {item.size}</span>}
                    </div>
                    <span className="text-muted">${(finalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <hr className="my-3 border-secondary border-opacity-20" />

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Shipping Cost</span>
              {shippingCost === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                <span className="text-white">${shippingCost.toFixed(2)}</span>
              )}
            </div>

            <hr className="my-3 border-secondary border-opacity-20" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-white fw-bold">Total Pay</span>
              <span className="fs-4 fw-extrabold text-gradient">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary-glow w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  <i className="bi bi-lock-fill"></i>
                  <span>Place Secure Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Checkout;
