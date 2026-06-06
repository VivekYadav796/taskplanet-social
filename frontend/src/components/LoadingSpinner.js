import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="loading-container">
    <Spinner animation="border" style={{ color: 'var(--tp-primary)', width: 40, height: 40 }} />
    <p className="loading-text">{text}</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
      <div className="flex-1" style={{ flex: 1 }}>
        <div className="skeleton mb-2" style={{ height: 14, width: '40%' }} />
        <div className="skeleton" style={{ height: 11, width: '25%' }} />
      </div>
    </div>
    <div className="skeleton mb-2" style={{ height: 13, width: '90%' }} />
    <div className="skeleton mb-2" style={{ height: 13, width: '70%' }} />
    <div className="skeleton mb-3" style={{ height: 180 }} />
    <div className="d-flex gap-3">
      <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 8 }} />
      <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 8 }} />
      <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 8 }} />
    </div>
  </div>
);

export default LoadingSpinner;
