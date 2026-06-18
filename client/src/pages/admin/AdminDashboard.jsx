import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
        setToastMessage('Error loading admin analytics');
        setToastType('danger');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) return <p className="text-muted">No analytics data available.</p>;

  const { summary, monthlySales, categorySales, recentOrders } = stats;

  // Chart 1: Monthly Sales Line Chart
  const lineChartData = {
    labels: monthlySales.map((s) => s.month),
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: monthlySales.map((s) => s.sales),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointHoverRadius: 7
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  // Chart 2: Category Distribution Doughnut Chart
  const doughnutChartData = {
    labels: categorySales.map((c) => c.categoryName),
    datasets: [
      {
        data: categorySales.map((c) => c.count),
        backgroundColor: [
          '#6366f1', // Indigo
          '#a855f7', // Purple
          '#14b8a6', // Teal
          '#f59e0b', // Amber
          '#ef4444', // Red
          '#3b82f6'  // Blue
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f3f4f6',
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Page Title */}
      <div>
        <h3 className="text-white font-heading mb-1">Overview Stats</h3>
        <p className="text-muted small">Real-time e-commerce revenue and inventory data summary</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4">
        {/* Total Revenue */}
        <div className="col-lg-3 col-md-6">
          <div className="card glass-card p-4 h-100 border-start border-3 border-indigo" style={{ borderLeftColor: 'var(--primary-color) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase">Total Revenue</span>
              <i className="bi bi-wallet2 fs-4 text-indigo" style={{ color: 'var(--primary-color)' }}></i>
            </div>
            <h3 className="fw-extrabold text-gradient mb-0">${summary.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-lg-3 col-md-6">
          <div className="card glass-card p-4 h-100 border-start border-3 border-purple" style={{ borderLeftColor: 'var(--secondary-color) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase">Orders Placed</span>
              <i className="bi bi-bag-check fs-4 text-purple" style={{ color: 'var(--secondary-color)' }}></i>
            </div>
            <h3 className="fw-extrabold text-white mb-0">{summary.totalOrders}</h3>
          </div>
        </div>

        {/* Total Products */}
        <div className="col-lg-3 col-md-6">
          <div className="card glass-card p-4 h-100 border-start border-3 border-teal" style={{ borderLeftColor: 'var(--accent-color) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase">Active Catalog</span>
              <i className="bi bi-box-seam fs-4 text-teal" style={{ color: 'var(--accent-color)' }}></i>
            </div>
            <h3 className="fw-extrabold text-white mb-0">{summary.totalProducts}</h3>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-lg-3 col-md-6">
          <div className="card glass-card p-4 h-100 border-start border-3 border-info" style={{ borderLeftColor: '#0ea5e9 !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase">Registered Users</span>
              <i className="bi bi-people fs-4 text-info"></i>
            </div>
            <h3 className="fw-extrabold text-white mb-0">{summary.totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4">
        {/* Sales Chart */}
        <div className="col-lg-8 col-12">
          <div className="card glass-card p-4">
            <h5 className="text-white mb-4 font-heading"><i className="bi bi-graph-up me-2 text-indigo" style={{ color: 'var(--primary-color)' }}></i> Sales Analytics</h5>
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Category Share Chart */}
        <div className="col-lg-4 col-12">
          <div className="card glass-card p-4">
            <h5 className="text-white mb-4 font-heading"><i className="bi bi-pie-chart me-2 text-purple" style={{ color: 'var(--secondary-color)' }}></i> Category Sizes</h5>
            <div style={{ height: '300px' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card glass-card p-4">
        <h5 className="text-white mb-4 font-heading"><i className="bi bi-receipt-cutoff me-2 text-teal" style={{ color: 'var(--accent-color)' }}></i> Recent Customer Orders</h5>
        
        {recentOrders.length === 0 ? (
          <p className="text-muted small mb-0">No customer orders placed yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 small">
              <thead>
                <tr className="border-secondary border-opacity-10 text-muted">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Grand Total</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-secondary border-opacity-10">
                    <td className="fw-bold">{order._id.substring(0, 10)}...</td>
                    <td>{order.customerName}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="fw-bold text-gradient">${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`badge rounded-pill px-2 py-1 ${order.orderStatus === 'Delivered' ? 'badge-glow-success' : 'badge-glow-warning'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-2 py-1 ${order.paymentStatus === 'Paid' ? 'badge-glow-success' : 'badge-glow-warning'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default AdminDashboard;
