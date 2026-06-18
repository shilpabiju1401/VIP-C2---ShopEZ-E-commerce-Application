import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  // Form State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      setToastMessage('Username and Email are required');
      setToastType('warning');
      return;
    }

    if (password && password !== confirmPassword) {
      setToastMessage('Passwords do not match');
      setToastType('danger');
      return;
    }

    setLoading(true);
    const payload = {
      username,
      email,
      phone,
      profileImage
    };

    if (password) {
      payload.password = password;
    }

    const res = await updateProfile(payload);
    setLoading(false);

    if (res.success) {
      setToastMessage('Profile updated successfully!');
      setToastType('success');
      setPassword('');
      setConfirmPassword('');
    } else {
      setToastMessage(res.message);
      setToastType('danger');
    }
  };

  return (
    <div className="container py-4 text-white">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="font-heading mb-4 text-white">Profile Settings</h2>

          <div className="card glass-card p-4">
            <form onSubmit={handleSubmit} className="row g-4">
              
              {/* Profile Avatar / Mock display */}
              <div className="col-12 d-flex flex-column flex-sm-row align-items-center gap-3 mb-2">
                <div
                  className="rounded-circle overflow-hidden bg-white bg-opacity-5 d-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px', border: '2px solid var(--primary-color)' }}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    <i className="bi bi-person fs-1 text-muted"></i>
                  )}
                </div>
                <div>
                  <h5 className="text-white mb-1 font-heading">{user?.username}</h5>
                  <span className="badge bg-indigo text-uppercase px-3 py-2 small" style={{ backgroundColor: 'var(--primary-color)' }}>
                    Role: {user?.role}
                  </span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="col-md-6">
                <label className="form-label text-muted small">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
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

              <div className="col-md-6">
                <label className="form-label text-muted small">Profile Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  disabled={loading}
                />
              </div>

              <hr className="my-3 border-secondary border-opacity-10 col-12" />

              {/* Password update sub-section */}
              <div className="col-12">
                <h6 className="text-white mb-2 font-heading"><i className="bi bi-key me-2 text-gradient"></i> Change Password (optional)</h6>
                <p className="text-muted small">Leave these fields blank if you do not wish to update your login password.</p>
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Submit button */}
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary-glow px-5 py-3 rounded-pill d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <i className="bi bi-save"></i>
                      <span>Save Profile Settings</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
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

export default Profile;
