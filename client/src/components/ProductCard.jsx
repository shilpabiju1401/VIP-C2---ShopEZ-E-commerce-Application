import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product, onShowMessage }) => {
  const { addToCart } = useContext(CartContext);
  const { _id, title, price, discount, images, brand, ratings, stock } = product;

  // Calculate discounted price
  const discountAmount = price * (discount / 100);
  const finalPrice = (price - discountAmount).toFixed(2);

  const handleQuickAdd = async (e) => {
    e.preventDefault(); // Stop redirection if nested in Link
    if (stock <= 0) return;

    const res = await addToCart(product, 1);
    if (res.success) {
      if (onShowMessage) {
        onShowMessage('Added to cart successfully!', 'success');
      }
    } else {
      if (onShowMessage) {
        onShowMessage(res.message, 'danger');
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    const ratingVal = ratings || 5;
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingVal)) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
      } else if (i - 0.5 <= ratingVal) {
        stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-muted me-1"></i>);
      }
    }
    return stars;
  };

  const mainImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="card glass-card h-100 p-3 d-flex flex-column">
      <Link to={`/product/${_id}`} className="text-decoration-none text-white flex-grow-1">
        <div className="product-card-img-wrapper mb-3">
          {discount > 0 && (
            <span className="discount-badge">-{discount}% Off</span>
          )}
          <img
            src={mainImage}
            alt={title}
            className="product-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small text-uppercase" style={{ letterSpacing: '0.05em' }}>{brand}</span>
          <div className="small d-flex align-items-center">
            {renderStars()}
            <span className="text-muted ms-1">({ratings || 5})</span>
          </div>
        </div>

        <h5 className="card-title text-truncate text-white mb-2" title={title}>{title}</h5>
      </Link>

      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-10">
        <div>
          {discount > 0 ? (
            <div className="d-flex flex-column">
              <span className="text-muted text-decoration-line-through small">${price.toFixed(2)}</span>
              <span className="fs-5 fw-bold text-gradient">${finalPrice}</span>
            </div>
          ) : (
            <span className="fs-5 fw-bold text-white">${price.toFixed(2)}</span>
          )}
        </div>

        {stock > 0 ? (
          <button
            onClick={handleQuickAdd}
            className="btn btn-primary-glow btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', padding: 0 }}
            title="Quick Add to Cart"
          >
            <i className="bi bi-cart-plus fs-5"></i>
          </button>
        ) : (
          <span className="badge bg-secondary text-uppercase py-2 px-3 rounded-pill" style={{ fontSize: '0.65rem' }}>Out of Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
