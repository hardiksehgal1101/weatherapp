import React from "react";
import './WeatherComponent.css';
import AirQuality from "./AirQuality";
import { motion } from "framer-motion";
import Forecast from "./Forecast";

export const WeatherIcons = {
    "01d": "/icons/sunny.png",
    "01n": "/icons/night.png",
    "02d": "/icons/day.png",
    "02n": "/icons/cloudy-night.png",
    "03d": "/icons/cloudy.png",
    "03n": "/icons/cloudy.png",
    "04d": "/icons/perfect-day.png",
    "04n": "/icons/cloudy-night.png",
    "09d": "/icons/rain.png",
    "09n": "/icons/rain-night.png",
    "10d": "/icons/rain.png",
    "10n": "/icons/rain-night.png",
    "11d": "/icons/storm.png",
    "11n": "/icons/storm.png"
};

const WeatherInfoIcons = {
    sunset: "/icons/night.svg",
    sunrise: "/icons/sunny.svg",
    humidity: "/icons/humidity.svg",
    wind: "/icons/wind.svg",
    pressure: "/icons/pressure.svg",
    visibility: "/icons/day.svg",
    clouds: "/icons/cloudy.svg",
};

const getWindDir = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
};

const WeatherInfoComponent = ({ name, value, delay }) => {
    return (
        <motion.div 
            className="info-tile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <img alt={name} className="info-icon" src={WeatherInfoIcons[name]} />
            <div className="info-text">
                <span className="info-value">{value}</span>
                <span className="info-label">{name}</span>
            </div>
        </motion.div>
    );
};

const WeatherComponent = (props) => {
    const { weather, aqi, unit, toggleUnit, forecast } = props;
    const isDay = weather?.weather[0].icon?.includes('d');
    const icon = weather.weather[0].icon;

    const getTime = (timeStamp) => {
        const date = new Date(timeStamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <motion.div 
            className="weather-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="card-header">
                <span id="Location">{`${weather?.name}, ${weather?.sys?.country}`}</span>
                <div className="unit-toggle-pill" onClick={toggleUnit}>
                    <span className={unit === 'metric' ? 'active' : ''}>°C</span>
                    <span className="divider">|</span>
                    <span className={unit === 'imperial' ? 'active' : ''}>°F</span>
                </div>
            </div>

            <div className="main-info">
                <div className="temp-section">
                    <div className="temp-main">
                        <span className="temperature">{`${Math.floor(weather?.main?.temp)}°`}</span>
                        <span className="feels-like">Feels like {Math.floor(weather?.main?.feels_like)}°</span>
                    </div>
                    <span className="weather-desc">{weather?.weather[0].description}</span>
                </div>
                <motion.img 
                    className="weather-icon" 
                    src={WeatherIcons[icon] || `http://openweathermap.org/img/wn/${icon}@2x.png`} 
                    alt="weather-icon"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                />
            </div>

            <div className="info-grid">
                <WeatherInfoComponent delay={0.1} name={isDay ? "sunset" : "sunrise"}
                    value={getTime(weather?.sys[isDay ? "sunset" : "sunrise"])} />
                <WeatherInfoComponent delay={0.2} name={"humidity"} value={`${weather?.main?.humidity}%`} />
                <WeatherInfoComponent delay={0.3} name={"wind"} value={`${weather?.wind?.speed} ${unit === 'metric' ? 'm/s' : 'mph'} ${getWindDir(weather?.wind?.deg)}`} />
                <WeatherInfoComponent delay={0.4} name={"visibility"} value={`${(weather?.visibility / 1000).toFixed(1)} km`} />
                <WeatherInfoComponent delay={0.5} name={"pressure"} value={`${weather?.main?.pressure} hPa`} />
                <WeatherInfoComponent delay={0.6} name={"clouds"} value={`${weather?.clouds?.all}%`} />
            </div>

            <motion.div 
                className="aqi-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <div className="aqi-header">Air Quality Index</div>
                <AirQuality aqi={aqi} />
            </motion.div>

            <Forecast forecast={forecast} unit={unit} />

            <div className="back-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <lord-icon
                    src="https://cdn.lordicon.com/xsratgwo.json"
                    trigger="hover"
                    style={{width:'20px',height:'20px',transform:'rotate(180deg)'}}
                />
                <span>Back to Top</span>
            </div>
        </motion.div>
    );
};

export default WeatherComponent;
