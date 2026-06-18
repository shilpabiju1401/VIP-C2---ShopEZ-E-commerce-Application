import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Admin...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not an admin
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row g-0 m-0">
          {/* Left Sidebar */}
          <div className="col-lg-2 col-md-3 p-0">
            <Sidebar />
          </div>

          {/* Right Main Content */}
          <div className="col-lg-10 col-md-9 p-4 text-white" style={{ minHeight: 'calc(100vh - 72px)' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
