import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setToastMessage('Please fill in all required fields');
      setToastType('danger');
      return;
    }

    if (password.length < 6) {
      setToastMessage('Password must be at least 6 characters long');
      setToastType('danger');
      return;
    }

    setLoading(true);
    const res = await register(username, email, password, phone);
    setLoading(false);

    if (res.success) {
      setToastMessage('Registration successful! Welcome to ShopEZ.');
      setToastType('success');
      // Navigated by useEffect
    } else {
      setToastMessage(res.message);
      setToastType('danger');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8 col-sm-10">
          <div className="card glass-card p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="text-white font-heading">Create Account</h2>
              <p className="text-muted small">Join us and start shopping modern products</p>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-muted small">Username <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="form-label text-muted small">Email Address <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="form-label text-muted small">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="123-456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label text-muted small">Password <span className="text-danger">*</span></label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-check my-2">
                <input type="checkbox" className="form-check-input" id="termsCheck" required />
                <label className="form-check-label text-muted small" htmlFor="termsCheck">
                  I agree to the <a href="#" className="text-decoration-none text-gradient fw-semibold">Terms & Conditions</a>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary-glow w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-decoration-none small text-gradient fw-semibold">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Register;
