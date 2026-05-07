import React from 'react'
import './AirQuality.css'
import { motion } from 'framer-motion'

const AirQuality = ({ aqi }) => {
  if (!aqi) return <div>AQI Unavailable</div>;

  const aqiMap = {
    1: { label: "Good", color: "#48c9b0", desc: "Healthy Air" },
    2: { label: "Fair", color: "#f1c40f", desc: "Acceptable Air" },
    3: { label: "Moderate", color: "#e67e22", desc: "Watch out!" },
    4: { label: "Poor", color: "#e74c3c", desc: "Unhealthy Air" },
    5: { label: "Very Poor", color: "#9b59b2", desc: "Hazardous Air" }
  };

  const status = aqiMap[aqi.main.aqi] || { label: "Unknown", color: "#ccc", desc: "No data" };

  const components = [
    { name: "PM 2.5", value: aqi.components.pm2_5 },
    { name: "NO₂", value: aqi.components.no2 },
    { name: "O₃", value: aqi.components.o3 },
    { name: "CO", value: Math.round(aqi.components.co) }
  ];

  return (
    <div className="aqi-dashboard">
      <div className="aqi-status-header">
        <div className="aqi-level-indicator">
          <div className="level-bar-bg">
            <div 
              className="level-bar-fill" 
              style={{ width: `${(aqi.main.aqi / 5) * 100}%`, backgroundColor: status.color }}
            ></div>
          </div>
          <div className="level-labels">
            <span className="current-level">Level {aqi.main.aqi}</span>
            <span className="level-desc">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="pollutants-grid">
        {components.map((comp, idx) => (
          <motion.div 
            key={comp.name} 
            className="pollutant-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span className="p-val">{comp.value}</span>
            <span className="p-name">{comp.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AirQuality;

