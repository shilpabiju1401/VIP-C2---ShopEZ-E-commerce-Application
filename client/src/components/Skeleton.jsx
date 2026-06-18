import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="card glass-card h-100 p-3" style={{ borderStyle: 'dashed' }}>
      <div className="placeholder-glow">
        <div className="placeholder col-12 rounded" style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
      </div>
      <div className="card-body px-0 pb-0 placeholder-glow">
        <h5 className="card-title placeholder col-8" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></h5>
        <p className="card-text placeholder col-5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="placeholder col-4" style={{ height: '24px', backgroundColor: 'rgba(255,255,255,0.06)' }}></span>
          <span className="placeholder col-4 rounded-pill" style={{ height: '36px', backgroundColor: 'rgba(255,255,255,0.06)' }}></span>
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="row g-5">
      <div className="col-md-6 placeholder-glow">
        <div className="placeholder col-12 rounded" style={{ height: '450px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
      </div>
      <div className="col-md-6 placeholder-glow">
        <div className="placeholder col-4 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-10 mb-4" style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-3 mb-4" style={{ height: '24px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-12 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-12 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-8 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="placeholder col-6 mb-4" style={{ height: '30px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        <div className="d-flex gap-3 placeholder-glow">
          <div className="placeholder col-4 rounded-pill" style={{ height: '45px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default { CardSkeleton, DetailSkeleton };
