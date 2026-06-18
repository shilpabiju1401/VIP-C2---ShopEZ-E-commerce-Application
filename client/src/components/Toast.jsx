import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'border-success text-success';
      case 'danger':
      case 'error':
        return 'border-danger text-danger';
      case 'warning':
        return 'border-warning text-warning';
      default:
        return 'border-primary text-primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'danger':
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100, maxWidth: '350px' }}
    >
      <div
        className={`card glass-card shadow p-3 border ${getToastClass()}`}
        style={{
          background: '#0f172a',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <i className={`bi ${getIcon()} fs-4`}></i>
          <div className="flex-grow-1 text-white" style={{ fontSize: '0.9rem' }}>{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
