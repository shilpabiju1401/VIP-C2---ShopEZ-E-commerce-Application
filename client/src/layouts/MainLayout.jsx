import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>

      <footer className="py-5 mt-5 border-top border-secondary border-opacity-10" style={{ backgroundColor: '#0b0f19' }}>
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4 col-md-6">
              <h5 className="text-white mb-3">ShopEZ</h5>
              <p className="text-muted small">
                A premium, modern MERN stack e-commerce web platform. Designed to offer a state-of-the-art catalog browsing, checkout, and inventory management experience.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-muted"><i className="bi bi-facebook fs-5"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-twitter-x fs-5"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-instagram fs-5"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-linkedin fs-5"></i></a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Shop</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="/products" className="text-muted text-decoration-none">All Products</a></li>
                <li><a href="/products?category=electronics" className="text-muted text-decoration-none">Electronics</a></li>
                <li><a href="/products?category=fashion" className="text-muted text-decoration-none">Fashion</a></li>
                <li><a href="/products?category=home-living" className="text-muted text-decoration-none">Home & Living</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Account</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="/profile" className="text-muted text-decoration-none">My Profile</a></li>
                <li><a href="/orders" className="text-muted text-decoration-none">Order History</a></li>
                <li><a href="/cart" className="text-muted text-decoration-none">Shopping Cart</a></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6">
              <h6 className="text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Contacts</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt"></i> 100 Tech Blvd, Silicon Valley, CA
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope"></i> support@shopez.com
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-telephone"></i> +1 (555) 019-2834
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-4 border-secondary border-opacity-10" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <span className="text-muted small">© 2026 ShopEZ Inc. All rights reserved.</span>
            <div className="d-flex gap-3 small">
              <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
              <a href="#" className="text-muted text-decoration-none">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
