import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';
import CityComponent from "./modules/CityComponent";
import WeatherComponent from "./modules/WeatherComponent";
import SkeletonLoader from "./modules/SkeletonLoader";
import ErrorMessage from "./modules/ErrorMessage";

const AppId = process.env.REACT_APP_API_KEY;
const isGeoEnabled = process.env.REACT_APP_ENABLE_GEOLOCATION !== 'false';

function App() {
  const [city, updateCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, updateWeather] = useState(null);
  const [aqi, updateAQI] = useState(null);
  const [forecast, updateForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);

  // Load search history from local storage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
    setSearchHistory(history);

    // Outside click listener for suggestions
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (cityName) => {
    if (!cityName) return;
    const updatedHistory = [cityName, ...searchHistory.filter(c => c !== cityName)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(updatedHistory));
  };

  const resetApp = () => {
    updateWeather(null);
    updateAQI(null);
    updateForecast(null);
    updateCity("");
    setSuggestions([]);
    setError(null);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === "metric" ? "imperial" : "metric");
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await Axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${AppId}`
      );
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    updateCity(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = `${suggestion.name}, ${suggestion.country}`;
    updateCity(cityName);
    setSuggestions([]);
    fetchWeather(null, cityName);
  };

  const fetchWeather = async (e, cityParam) => {
    if (e) e.preventDefault();
    const searchCity = cityParam || city;
    
    if (!searchCity) {
      setValidationError(true);
      setTimeout(() => setValidationError(false), 600);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const validationResponse = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${AppId}&units=${unit}`
      );

      const { lat, lon } = validationResponse.data.coord;

      const [forecastResponse, airQualityResponse] = await Promise.all([
        Axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=${unit}`
        ),
        Axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`
        ),
      ]);

      updateWeather(validationResponse.data);
      updateAQI(airQualityResponse.data.list[0]);
      updateForecast(forecastResponse.data);
      saveToHistory(validationResponse.data.name);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("City not found or weather data unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch weather when unit changes
  useEffect(() => {
    if (weather?.name) {
      fetchWeather(null, weather.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  useEffect(() => {
    if (!isGeoEnabled) return;

    const getLocation = async () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await Axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${AppId}&units=${unit}`
              );

              const { lat, lon } = response.data.coord;

              const [forecastResponse, airQualityResponse] = await Promise.all([
                Axios.get(
                  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=${unit}`
                ),
                Axios.get(
                  `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`
                ),
              ]);

              updateWeather(response.data);
              updateAQI(airQualityResponse.data.list[0]);
              updateForecast(forecastResponse.data);
            } catch (err) {
              console.error("Error fetching geolocation weather data:", err);
            } finally {
              setLoading(false);
            }
          },
          () => {
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
      }
    };

    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGeoEnabled]);

  return (
    <div id="Container">
      <ErrorMessage message={error} onClose={() => setError(null)} />
      
      <motion.span 
        id="AppLabel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Weathernest
      </motion.span>

      <div className="search-container" ref={searchRef}>
        <motion.form 
          id="SearchBox" 
          onSubmit={fetchWeather}
          animate={validationError ? { x: [-5, 5, -5, 5, 0], borderColor: "rgba(255, 0, 0, 0.5)" } : {}}
          transition={{ duration: 0.4 }}
          className={validationError ? 'error' : ''}
        >
          <div className="input-wrapper">
            <input
              value={city}
              onChange={handleInputChange}
              placeholder="Enter City"
            />
            <AnimatePresence>
              {validationError && (
                <motion.span 
                  className="validation-msg"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  Please enter a city name
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="search-actions">
            {weather && (
              <button type="button" className="home-btn" onClick={resetApp}>
                <lord-icon
                    src="https://cdn.lordicon.com/osuxyevn.json"
                    trigger="hover"
                    style={{width:'20px',height:'20px'}}
                  />
              </button>
            )}
            {isGeoEnabled && (
              <button type="button" className="geo-btn" onClick={() => window.location.reload()}>
                <lord-icon
                    src="https://cdn.lordicon.com/msetysan.json"
                    trigger="hover"
                    style={{width:'20px',height:'20px'}}
                  />
              </button>
            )}
            <button type="submit" className="search-btn">
              <lord-icon
                src="https://cdn.lordicon.com/pvbutfdk.json"
                trigger="hover"
                style={{width:'25px',height:'25px'}}
              />
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.ul 
              className="suggestions-list"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name}, {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {searchHistory.length > 0 && !weather && !loading && (
        <div className="search-history">
          {searchHistory.map((h, i) => (
            <span key={i} onClick={() => fetchWeather(null, h)} className="history-chip">
              {h}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <SkeletonLoader />
          </motion.div>
        ) : weather ? (
          <motion.div
            key="weather"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <WeatherComponent 
              weather={weather} 
              city={city} 
              aqi={aqi} 
              forecast={forecast} 
              unit={unit} 
              toggleUnit={toggleUnit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="city"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
          </motion.div>
        )}
      </AnimatePresence>


      <div id="copyright">©Hardiksehgal</div>
    </div>
  );
}

export default App;
;