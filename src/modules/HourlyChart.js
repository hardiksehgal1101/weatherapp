import React from 'react';
import './HourlyChart.css';
import { motion } from 'framer-motion';

const HourlyChart = ({ forecast, unit }) => {
    if (!forecast || !forecast.list) return null;

    // Get the next 8 intervals (24 hours)
    const hourlyData = forecast.list.slice(0, 8);

    return (
        <div className="hourly-container">
            <h3 className="hourly-title">Next 24 Hours</h3>
            <div className="hourly-scroll">
                {hourlyData.map((item, idx) => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const temp = Math.round(item.main.temp);
                    const icon = item.weather[0].icon;

                    return (
                        <motion.div 
                            key={idx} 
                            className="hourly-item"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <span className="hourly-time">{time}</span>
                            <img 
                                src={`http://openweathermap.org/img/wn/${icon}.png`} 
                                alt="hourly-icon" 
                                className="hourly-icon"
                            />
                            <span className="hourly-temp">{temp}°</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyChart;
