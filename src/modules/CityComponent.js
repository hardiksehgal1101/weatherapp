import React from 'react'
import './CityComponent.css'
import { motion } from 'framer-motion'

const CityComponent = (props) => {
  const { fetchWeather } = props;
  const popularCities = ["London", "New York", "Mumbai", "Tokyo", "Paris"];

  return (
    <motion.div 
      className="welcome-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="welcome-content">
        <h1>Find Your Sky</h1>
        <p>Check the weather and air quality in any city across the globe.</p>
        
        <div className="popular-cities">
          {popularCities.map(city => (
            <button 
              key={city} 
              className="city-btn"
              onClick={() => fetchWeather(null, city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CityComponent;
