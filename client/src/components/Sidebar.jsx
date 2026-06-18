import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="admin-sidebar d-flex flex-column py-4">
      <div className="px-4 mb-4">
        <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.1em' }}>Admin Panel</span>
      </div>

      <NavLink
        to="/admin"
        end
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <i className="bi bi-speedometer2 fs-5"></i>
        <span>Overview Stats</span>
      </NavLink>

      <NavLink
        to="/admin/products"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <i className="bi bi-box-seam fs-5"></i>
        <span>Manage Products</span>
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <i className="bi bi-tags fs-5"></i>
        <span>Manage Categories</span>
      </NavLink>

      <NavLink
        to="/admin/orders"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <i className="bi bi-currency-dollar fs-5"></i>
        <span>Manage Orders</span>
      </NavLink>

      <NavLink
        to="/admin/banners"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <i className="bi bi-sliders fs-5"></i>
        <span>Storefront Setup</span>
      </NavLink>

      <div className="mt-auto px-4 pt-4 border-top border-secondary border-opacity-10">
        <NavLink to="/" className="text-decoration-none text-muted small d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i> Back to Storefront
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
