import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Skeleton';
import api from '../services/api';
import Toast from '../components/Toast';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data && res.data.bannerImages) {
          setBanners(res.data.bannerImages);
        }
      } catch (err) {
        // Fallback banners
        setBanners([
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
        ]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCats(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?featured=true&limit=4');
        setFeaturedProducts(res.data.products);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBanners();
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  const handleShowToast = (msg, type) => {
    setToastMessage(msg);
    setToastType(type);
  };

  return (
    <div className="container">
      {/* 1. Hero Carousel Section */}
      <section className="mb-5">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="carousel-inner rounded-4 overflow-hidden border border-secondary border-opacity-10">
            {banners.map((imgUrl, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div
                  className="hero-carousel-item"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                >
                  <div className="hero-overlay">
                    <div className="col-lg-7 col-md-10 text-white">
                      <span className="badge bg-indigo mb-3 text-uppercase py-2 px-3 fw-bold" style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>New Arrivals</span>
                      <h1 className="display-4 fw-extrabold mb-3 font-heading text-white">
                        Elevate Your Lifestyle <br />
                        with <span className="text-gradient">ShopEZ</span>
                      </h1>
                      <p className="lead mb-4 text-muted" style={{ fontSize: '1.1rem' }}>
                        Discover a premium collection of designer apparel, high-performance gadgets, and minimalist home accessories tailored for your modern routine.
                      </p>
                      <div className="d-flex gap-3">
                        <Link to="/products" className="btn btn-primary-glow px-4 py-3 rounded-pill d-flex align-items-center gap-2">
                          <span>Browse Collection</span>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                        <Link to="/products?featured=true" className="btn btn-outline-glass px-4 py-3 rounded-pill">
                          View Featured
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* 2. Value Propositions */}
      <section className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 d-flex flex-row align-items-start gap-3">
            <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
              <i className="bi bi-truck fs-3"></i>
            </div>
            <div>
              <h5 className="text-white mb-2">Free Shipping</h5>
              <p className="text-muted small mb-0">Complementary shipping on all payments and COD orders above $50.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 d-flex flex-row align-items-start gap-3">
            <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-color)' }}>
              <i className="bi bi-shield-check fs-3"></i>
            </div>
            <div>
              <h5 className="text-white mb-2">Secure Checkout</h5>
              <p className="text-muted small mb-0">End-to-end encrypted details processing via debit, card, or Cash on Delivery.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 d-flex flex-row align-items-start gap-3">
            <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary-color)' }}>
              <i className="bi bi-arrow-counterclockwise fs-3"></i>
            </div>
            <div>
              <h5 className="text-white mb-2">Hassle-Free Returns</h5>
              <p className="text-muted small mb-0">Change your mind? Get simple refunds within 30 days of purchase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse Categories */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white font-heading mb-1">Browse Categories</h2>
            <p className="text-muted small">Explore products curated for specific rooms and tasks</p>
          </div>
          <Link to="/products" className="text-decoration-none text-gradient fw-semibold">View All Catalogs →</Link>
        </div>

        <div className="row g-4">
          {loadingCats ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="col-lg-3 col-md-6 placeholder-glow">
                <div className="placeholder col-12 rounded-4" style={{ height: '280px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="col-lg-3 col-md-6">
                <Link to={`/products?category=${cat.slug}`} className="text-decoration-none text-white">
                  <div
                    className="card glass-card overflow-hidden h-100 p-0 border border-secondary border-opacity-10 position-relative"
                    style={{ minHeight: '280px' }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.35,
                        zIndex: 1,
                        transition: 'var(--transition-smooth)'
                      }}
                      className="category-img-bg"
                    />
                    <div
                      className="card-body p-4 d-flex flex-column justify-content-end position-relative"
                      style={{ zIndex: 2, height: '100%', minHeight: '280px', background: 'linear-gradient(to top, rgba(9,13,22,0.9) 20%, rgba(9,13,22,0.1) 100%)' }}
                    >
                      <h4 className="text-white font-heading mb-2">{cat.name}</h4>
                      <p className="text-muted small mb-0">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white font-heading mb-1">Featured Items</h2>
            <p className="text-muted small">Hand-picked collection of top-rated modern items</p>
          </div>
          <Link to="/products" className="text-decoration-none text-gradient fw-semibold">View Catalog →</Link>
        </div>

        <div className="row g-4">
          {loadingProducts ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <CardSkeleton />
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <div key={product._id} className="col-lg-3 col-md-6">
                <ProductCard product={product} onShowMessage={handleShowToast} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Toast notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Home;
