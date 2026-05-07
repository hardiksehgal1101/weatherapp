import React from 'react';
import './Forecast.css';
import { motion } from 'framer-motion';
import { WeatherIcons } from './WeatherComponent';

const Forecast = ({ forecast, unit }) => {
    if (!forecast || !forecast.list) return null;

    // Group forecast by day and pick the best entry (preferably a 'day' icon)
    const displayForecast = Object.values(
        forecast.list.reduce((acc, item) => {
            const date = item.dt_txt.split(' ')[0];
            const isDayIcon = item.weather[0].icon.endsWith('d');
            
            // If we don't have this day yet, or if this new item is a 'day' icon and the previous wasn't
            if (!acc[date] || (isDayIcon && !acc[date].weather[0].icon.endsWith('d'))) {
                acc[date] = item;
            }
            return acc;
        }, {})
    ).slice(0, 5);

    return (
        <div className="forecast-container">
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-list">
                {displayForecast.map((item, idx) => {
                    const date = new Date(item.dt * 1000);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const iconId = item.weather[0].icon;
                    const localIcon = WeatherIcons[iconId] || `http://openweathermap.org/img/wn/${iconId}.png`;
                    
                    return (
                        <motion.div 
                            key={idx} 
                            className="forecast-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <span className="forecast-day">{dayName}</span>
                            <img 
                                src={localIcon} 
                                alt="weather-icon"
                                className="forecast-icon"
                            />
                            <div className="forecast-temps">
                                <span className="f-max">{Math.round(item.main.temp_max)}°</span>
                                <span className="f-min">{Math.round(item.main.temp_min)}°</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
