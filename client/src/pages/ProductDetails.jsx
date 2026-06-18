import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';
import api from '../services/api';
import Toast from '../components/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // API State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Interactive Form State
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      // Auto select first size option if available
      if (res.data.sizes && res.data.sizes.length > 0) {
        setSelectedSize(res.data.sizes[0]);
      }
    } catch (err) {
      console.error('Failed to load product details', err);
      setToastMessage('Product not found');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    const res = await addToCart(product, quantity, selectedSize);
    if (res.success) {
      setToastMessage('Item added to cart successfully!');
      setToastType('success');
    } else {
      setToastMessage(res.message);
      setToastType('danger');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setToastMessage('Please enter a review comment');
      setToastType('warning');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/review`, { rating, comment });
      setToastMessage('Review submitted successfully!');
      setToastType('success');
      setComment('');
      setRating(5);
      // Refresh details to show new review
      fetchProductDetails();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to submit review');
      setToastType('danger');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    const val = ratingValue || 5;
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(val)) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
      } else if (i - 0.5 <= val) {
        stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-muted me-1"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <DetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center text-muted">
        <i className="bi bi-exclamation-triangle fs-1 d-block mb-3 text-warning"></i>
        <h3>Product Not Found</h3>
        <p className="small">The item you are looking for may have been removed.</p>
        <Link to="/products" className="btn btn-primary-glow rounded-pill px-4 mt-2">Back to Catalog</Link>
      </div>
    );
  }

  const { title, description, price, discount, images, brand, stock, ratings, reviews, sizes, category } = product;
  const discountAmount = price * (discount / 100);
  const finalPrice = (price - discountAmount).toFixed(2);
  const mainImage = images && images.length > 0 ? images[activeImgIndex] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted small">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted small">Catalog</Link></li>
          <li className="breadcrumb-item active text-white small" aria-current="page">{title}</li>
        </ol>
      </nav>

      {/* Main Details Panel */}
      <div className="row g-5 mb-5">
        {/* Left Side: Images View */}
        <div className="col-md-6">
          <div className="card glass-card p-3 overflow-hidden border border-secondary border-opacity-10 mb-3" style={{ height: '450px' }}>
            <img
              src={mainImage}
              alt={title}
              className="w-100 h-100"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          {/* Thumbnail list */}
          {images && images.length > 1 && (
            <div className="d-flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className="btn p-0 border rounded overflow-hidden"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderColor: activeImgIndex === idx ? 'var(--primary-color)' : 'var(--glass-border)',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <img src={img} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details Form */}
        <div className="col-md-6 text-white">
          <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.05em' }}>{brand}</span>
          <h1 className="fw-bold mb-3 mt-1 font-heading text-white">{title}</h1>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center">
              {renderStars(ratings)}
              <span className="text-muted ms-2">({ratings})</span>
            </div>
            <span className="text-muted border-start border-secondary border-opacity-30 ps-3">Category: {category?.name || 'Store'}</span>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            {discount > 0 ? (
              <div className="d-flex align-items-center gap-3">
                <span className="fs-2 fw-extrabold text-gradient">${finalPrice}</span>
                <span className="text-muted text-decoration-line-through fs-5">${price.toFixed(2)}</span>
                <span className="badge bg-danger rounded-3 py-2 px-3 text-uppercase font-heading" style={{ fontSize: '0.8rem' }}>-{discount}% OFF</span>
              </div>
            ) : (
              <span className="fs-2 fw-extrabold text-gradient">${price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>{description}</p>

          {/* Sizing Select */}
          {sizes && sizes.length > 0 && (
            <div className="mb-4">
              <label className="form-label text-muted small">Select Size</label>
              <div className="d-flex gap-2">
                {sizes.map((sizeOption) => (
                  <button
                    key={sizeOption}
                    type="button"
                    onClick={() => setSelectedSize(sizeOption)}
                    className={`btn rounded-3 ${selectedSize === sizeOption ? 'btn-primary-glow' : 'btn-outline-glass'} px-3 py-2`}
                    style={{ minWidth: '50px' }}
                  >
                    {sizeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Badges & Add to Cart */}
          <div className="mb-4 d-flex align-items-center gap-3">
            <span className="text-muted small">Availability:</span>
            {stock > 10 ? (
              <span className="badge badge-glow-success py-2 px-3 rounded-pill">In Stock ({stock})</span>
            ) : stock > 0 ? (
              <span className="badge badge-glow-warning py-2 px-3 rounded-pill">Only {stock} units left!</span>
            ) : (
              <span className="badge badge-glow-danger py-2 px-3 rounded-pill">Out of Stock</span>
            )}
          </div>

          {stock > 0 && (
            <div className="d-flex gap-3 align-items-end mb-4">
              <div style={{ width: '120px' }}>
                <label className="form-label text-muted small">Quantity</label>
                <div className="input-group">
                  <button
                    className="btn btn-outline-glass border-end-0 py-2"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center bg-transparent border-start-0 border-end-0"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-glass border-start-0 py-2"
                    type="button"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary-glow flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span>Add to Shopping Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews & Feedback Panel */}
      <section className="row g-5">
        {/* Reviews List */}
        <div className="col-lg-7 text-white">
          <h3 className="font-heading text-white mb-4">Customer Reviews</h3>
          {reviews && reviews.length === 0 ? (
            <p className="text-muted small py-4">No reviews yet for this product. Be the first to share your experience!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev) => (
                <div key={rev._id} className="card glass-card p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="text-white mb-0">{rev.username}</h6>
                      <div className="mt-1">{renderStars(rev.rating)}</div>
                    </div>
                    <span className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted mb-0 small mt-2">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="col-lg-5">
          <div className="card glass-card p-4">
            <h4 className="font-heading text-white mb-3">Write a Review</h4>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-muted small">Rating</label>
                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Poor</option>
                    <option value="1">1 Star - Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-muted small">Comments</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Share your thoughts about this item..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-glow py-3 w-100"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-lock fs-2 d-block mb-2 text-secondary"></i>
                <p className="small mb-3">Only registered customers can leave product reviews.</p>
                <Link to="/login" className="btn btn-sm btn-outline-glass px-4">Sign In to Review</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default ProductDetails;
