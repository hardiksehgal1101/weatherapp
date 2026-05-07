import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-header">
                <div className="skeleton-temp"></div>
                <div className="skeleton-icon"></div>
            </div>
            <div className="skeleton-location"></div>
            <div className="skeleton-grid">
                <div className="skeleton-tile"></div>
                <div className="skeleton-tile"></div>
                <div className="skeleton-tile"></div>
                <div className="skeleton-tile"></div>
            </div>
            <div className="skeleton-aqi"></div>
        </div>
    );
};

export default SkeletonLoader;
