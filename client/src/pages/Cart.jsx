import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Cart = () => {
  const { cart, loading, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toast notifications state
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('success');

  const handleShowToast = (msg, type) => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleQtyChange = async (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > item.productId.stock) {
      handleShowToast(`Cannot select more than ${item.productId.stock} items (limit of stock)`, 'warning');
      return;
    }

    const res = await addToCart(item.productId, newQty, item.size);
    if (!res.success) {
      handleShowToast(res.message, 'danger');
    }
  };

  const handleRemoveItem = async (productId, size) => {
    const res = await removeFromCart(productId, size);
    if (res.success) {
      handleShowToast('Item removed from cart', 'success');
    } else {
      handleShowToast(res.message, 'danger');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      // Send to login, then redirect back to checkout
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  // Calculations
  const subtotal = cart.totalPrice;
  const shippingThreshold = 50.00;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0.00 : 5.99;
  const grandTotal = parseFloat((subtotal + shippingCost).toFixed(2));

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Cart...</span>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="card glass-card p-5 col-lg-6 mx-auto">
          <i className="bi bi-cart-x fs-1 d-block mb-3 text-secondary"></i>
          <h3 className="text-white font-heading">Your Cart is Empty</h3>
          <p className="small mb-4">Add products to your cart to begin shopping.</p>
          <Link to="/products" className="btn btn-primary-glow rounded-pill px-4">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 text-white">
      <h2 className="text-white font-heading mb-4">Shopping Cart</h2>

      <div className="row g-4">
        {/* Left: Cart Line Items list */}
        <div className="col-lg-8">
          <div className="card glass-card p-4 d-flex flex-column gap-4">
            {cart.items.map((item, idx) => {
              const product = item.productId;
              if (!product) return null;

              const discount = product.discount || 0;
              const unitPrice = product.price;
              const discountedUnitPrice = (unitPrice - (unitPrice * (discount / 100))).toFixed(2);
              const totalItemPrice = (discountedUnitPrice * item.quantity).toFixed(2);
              
              const imgUrl = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={`${product._id}-${item.size}-${idx}`}
                  className="d-flex flex-column flex-sm-row align-items-center gap-3 pb-4 border-bottom border-secondary border-opacity-10 last-no-border"
                >
                  {/* Thumbnail */}
                  <div className="rounded overflow-hidden bg-white bg-opacity-5" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                    <img src={imgUrl} alt={product.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>

                  {/* Title & metadata */}
                  <div className="flex-grow-1 text-center text-sm-start">
                    <Link to={`/product/${product._id}`} className="text-decoration-none text-white">
                      <h6 className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>{product.title}</h6>
                    </Link>
                    <span className="text-muted small d-block">Brand: {product.brand}</span>
                    {item.size && (
                      <span className="badge bg-secondary rounded-2 mt-1 small" style={{ fontSize: '0.75rem' }}>Size: {item.size}</span>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-glass"
                      onClick={() => handleQtyChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="fw-semibold px-2" style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-glass"
                      onClick={() => handleQtyChange(item, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Pricing and Action */}
                  <div className="text-center text-sm-end ms-sm-auto" style={{ minWidth: '100px' }}>
                    <span className="fs-6 fw-bold text-gradient d-block">${totalItemPrice}</span>
                    <span className="text-muted small d-block">
                      ${discountedUnitPrice} each
                    </span>
                    <button
                      onClick={() => handleRemoveItem(product._id, item.size)}
                      className="btn btn-sm btn-link text-danger text-decoration-none mt-1 p-0 small"
                    >
                      <i className="bi bi-trash me-1"></i> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="d-flex justify-content-between align-items-center mt-2">
              <Link to="/products" className="btn btn-outline-glass rounded-pill px-4 small">
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                style={{ fontSize: '0.8rem' }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right: Summary panel */}
        <div className="col-lg-4">
          <div className="card glass-card p-4">
            <h4 className="font-heading text-white mb-4">Summary</h4>

            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Subtotal</span>
              <span className="text-white fw-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Estimated Shipping</span>
              {shippingCost === 0 ? (
                <span className="text-success fw-medium">Free</span>
              ) : (
                <span className="text-white fw-medium">${shippingCost.toFixed(2)}</span>
              )}
            </div>

            {shippingCost > 0 && (
              <div className="alert alert-secondary py-2 px-3 small border-0 bg-white bg-opacity-5 text-muted mb-4">
                💡 Add <span className="text-white fw-bold">${(shippingThreshold - subtotal).toFixed(2)}</span> more to qualify for Free Shipping.
              </div>
            )}

            <hr className="my-3 border-secondary border-opacity-20" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-white fw-bold">Total Amount</span>
              <span className="fs-4 fw-extrabold text-gradient">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="btn btn-primary-glow w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CSS fix for last item border */}
      <style>{`
        .last-no-border:last-of-type {
          border-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>

      {/* Toast notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Cart;
