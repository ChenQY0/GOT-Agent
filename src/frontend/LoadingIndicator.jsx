import React from 'react';
import './css/LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="loading-indicator">
      <LoadingSpinner />
      <div className="loading-text">Loading...</div>
    </div>
  );
}

export default LoadingIndicator;

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner" />
  )
}