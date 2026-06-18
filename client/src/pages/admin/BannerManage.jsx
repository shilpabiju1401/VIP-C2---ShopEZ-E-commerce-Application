import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const BannerManage = () => {
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [bannersText, setBannersText] = useState('');
  const [announcementsText, setAnnouncementsText] = useState('');

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data) {
          setBannersText(res.data.bannerImages ? res.data.bannerImages.join('\n') : '');
          setAnnouncementsText(res.data.announcements ? res.data.announcements.join('\n') : '');
        }
      } catch (err) {
        console.error('Failed to load settings', err);
        setToastMessage('Failed to load settings');
        setToastType('danger');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bannerImages = bannersText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const announcements = announcementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await api.put('/admin/settings', { bannerImages, announcements });
      setToastMessage('Settings updated successfully!');
      setToastType('success');
    } catch (err) {
      setToastMessage('Failed to update storefront settings');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="text-white font-heading mb-1">Storefront Setup</h3>
        <p className="text-muted small">Update announcement bar strings and homepage slideshow images</p>
      </div>

      {/* Main panel card */}
      <div className="card glass-card p-4 col-lg-8">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            
            {/* Carousel images text area */}
            <div>
              <label className="form-label text-white fw-bold mb-2">Homepage Banners (one URL per line)</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="https://images.unsplash.com/photo-12345678...&#10;https://images.unsplash.com/photo-87654321..."
                value={bannersText}
                onChange={(e) => setBannersText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              ></textarea>
              <div className="text-muted small mt-2">
                💡 Enter full URLs to high-res graphics. We recommend Unsplash links (width 1200+ for carousels).
              </div>
            </div>

            {/* Announcement texts area */}
            <div>
              <label className="form-label text-white fw-bold mb-2">Announcement Bar Tickers (one announcement per line)</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="⚡ Use code SHOPEZ20 for discounts!&#10;🚚 Free delivery on checkout orders over $50!"
                value={announcementsText}
                onChange={(e) => setAnnouncementsText(e.target.value)}
              ></textarea>
              <div className="text-muted small mt-2">
                💡 The first line will display prominently in the gradient header banner above navigation menus.
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="btn btn-primary-glow px-5 py-3 rounded-pill d-flex align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up"></i>
                    <span>Apply Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Floating notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default BannerManage;
