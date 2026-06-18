import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');

  // Fetch banner announcement from admin settings
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data && res.data.announcements && res.data.announcements.length > 0) {
          setAnnouncement(res.data.announcements[0]);
        }
      } catch (err) {
        // Fallback banner
        setAnnouncement('⚡ ShopEZ MERN Store Live Demo - Check out our catalogs!');
      }
    };
    fetchAnnouncement();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      {announcement && (
        <div
          className="text-center py-2 px-3 text-white"
          style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #14b8a6 100%)',
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            zIndex: 1060,
            position: 'relative'
          }}
        >
          {announcement}
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark glass-navbar sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="fs-3" role="img" aria-label="cart">🛍️</span>
            <span className="fw-extrabold fs-4 text-white font-heading" style={{ letterSpacing: '-0.5px' }}>
              Shop<span className="text-gradient">EZ</span>
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#shopNavbar"
            aria-controls="shopNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="shopNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active text-white bg-white bg-opacity-10' : 'text-muted'}`} to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active text-white bg-white bg-opacity-10' : 'text-muted'}`} to="/products">
                  Catalog
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Shopping Cart Trigger */}
              <Link
                to="/cart"
                className="btn btn-outline-glass position-relative px-3 py-2 d-flex align-items-center gap-2"
                style={{ borderRadius: '20px' }}
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span className="d-none d-md-inline small">Cart</span>
                {getCartCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark px-2">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-primary-glow dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderRadius: '25px', padding: '8px 20px' }}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="bi bi-person-circle fs-5"></i>
                    )}
                    <span className="text-truncate" style={{ maxWidth: '100px' }}>{user.username}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark p-2 mt-2 shadow border border-secondary border-opacity-20" aria-labelledby="userDropdown" style={{ backgroundColor: '#0f172a', borderRadius: '12px' }}>
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-2" to="/profile">
                        <i className="bi bi-person text-muted"></i> Profile settings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-2" to="/orders">
                        <i className="bi bi-bag-check text-muted"></i> My Orders
                      </Link>
                    </li>
                    {isAdmin() && (
                      <>
                        <li><hr className="dropdown-divider border-secondary border-opacity-20" /></li>
                        <li>
                          <Link className="dropdown-item rounded-3 py-2 px-3 text-gradient fw-semibold d-flex align-items-center gap-2" to="/admin">
                            <i className="bi bi-speedometer2 text-purple"></i> Admin Dashboard
                          </Link>
                        </li>
                      </>
                    )}
                    <li><hr className="dropdown-divider border-secondary border-opacity-20" /></li>
                    <li>
                      <button className="dropdown-item rounded-3 py-2 px-3 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-glass px-4 py-2" style={{ borderRadius: '20px' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary-glow px-4 py-2" style={{ borderRadius: '20px' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
