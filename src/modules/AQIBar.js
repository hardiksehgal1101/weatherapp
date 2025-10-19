import React from "react";
import "./AQIBar.css";

const AQIBar = ({ Aqi }) => {
    const aqi = Aqi?.main?.aqi
  // Labels & colors for each category
  const levels = {
    1: { label: "Good", color: "#4CAF50" },
    2: { label: "Satisfactory", color: "#CDDC39" },
    3: { label: "Moderate", color: "#FFC107" },
    4: { label: "Poor", color: "#FF5722" },
    5: { label: "Very Poor", color: "#9C27B0" },
    6: { label: "Severe", color: "#B71C1C" },
  };

  const level = levels[aqi] || { label: "Unknown", color: "#9E9E9E" };
  const progress = (aqi / 6) * 100;

  return (
    <div className="aqi-container">
      <div className="aqi-label">
        <span>Air Quality Index:</span>
        <span className="aqi-value" style={{ color: level.color }}>
          {level.label}
        </span>
      </div>

      <div className="aqi-bar">
        <div
          className="aqi-progress"
          style={{ width: `${progress}%`, backgroundColor: level.color }}
        ></div>
      </div>

      {/* <p className="aqi-number">Category: {aqi}</p> */}
    </div>
  );
};

export default AQIBar;
