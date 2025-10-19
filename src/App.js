import React, { useState, useEffect } from "react";
import Axios from "axios";
import './App.css';
import CityComponent from "./modules/CityComponent";
import WeatherComponent from "./modules/WeatherComponent";

const AppId = process.env.REACT_APP_API_KEY;
const XRapidAPIKey = process.env.RAPID_API_KEY;
const XRapidAPIHost = process.env.RAPID_API_HOST;

function App() {
  const [city, updateCity] = useState("");
  const [suggestions, setSuggestions] = useState([]); // State for city suggestions
  const [weather, updateWeather] = useState(null);
  const [aqi, updateAQI] = useState(null);
  const [forecast, updateForecast] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [submitted, setSubmitted] = useState(false);

  // Fetch city suggestions and validate them with OpenWeatherMap API
  const fetchCitySuggestions = async (query) => {
    if (!query.trim()) { // Check if the query is empty or contains only spaces
      setSuggestions([]); // Clear suggestions
      return;
    }
    try {
      const response = await Axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
        {
          headers: {
            "X-RapidAPI-Key": XRapidAPIKey,
            "X-RapidAPI-Host": XRapidAPIHost,
          },
        }
      );

      const cityNames = response.data.data.map((city) => city.name);

      // Validate cities with OpenWeatherMap API
      const validCities = [];
      for (const cityName of cityNames) {
        try {
          const validationResponse = await Axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${AppId}`
          );
          if (validationResponse.data && validationResponse.data.coord) {
            validCities.push(cityName); // Add valid city to the list
          }
        } catch (error) {
          console.error(`City ${cityName} is not valid in OpenWeatherMap API.`);
        }
      }

      setSuggestions(validCities); // Update suggestions with valid cities only
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted
    setSubmitted(true);

    try {
      // Validate city with OpenWeatherMap API
      const validationResponse = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${AppId}`
      );

      if (!validationResponse.data || !validationResponse.data.coord) {
        throw new Error("City not found in OpenWeatherMap API");
      }

      const { lat, lon } = validationResponse.data.coord;

      // Fetch forecast and air quality data concurrently
      const [forecastResponse, airQualityResponse] = await Promise.all([
        Axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=metric`
        ),
        Axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`
        ),
      ]);

      // Update states with fetched data
      updateWeather(validationResponse.data);
      updateAQI(airQualityResponse.data.list[0]);
      updateForecast(forecastResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("City not found or weather data unavailable. Please try another city.");
    } finally {
      setLoading(false);
    }
  };

  // Get user's location on component mount
  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Fetch weather data based on geolocation
            try {
              const response = await Axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${AppId}&units=metric`
              );

              const { lat, lon } = response.data.coord;

              // Fetch forecast and air quality data concurrently
              const [forecastResponse, airQualityResponse] = await Promise.all([
                Axios.get(
                  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=metric`
                ),
                Axios.get(
                  `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`
                ),
              ]);

              // Update states with fetched data
              updateWeather(response.data);
              updateAQI(airQualityResponse.data.list[0]);
              updateForecast(forecastResponse.data);
            } catch (error) {
              console.error("Error fetching geolocation weather data:", error);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.log("Geolocation is not enabled");
            console.error(error);
            setLoading(false);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <div id="Container" className={!weather ? 'center-container' : ''}>
      <span id="AppLabel">
        Weathernest
      </span>
      <form id="SearchBox" onSubmit={fetchWeather}>
        <input
          required
          value={city}
          onChange={(e) => {
            const value = e.target.value.trim();
            updateCity(value);
            fetchCitySuggestions(value); // Fetch suggestions as user types
            if (value === "") {
              updateWeather(null); // Clear weather when input is empty
              updateAQI(null); // Clear AQI when input is empty
              updateForecast(null); // Clear forecast when input is empty
            }
          }} // Use trim to avoid leading spaces
          placeholder="Enter City"
        />
        <button type="submit">
          <lord-icon
            src="https://cdn.lordicon.com/pvbutfdk.json"
            trigger="hover"
          />
        </button>
        {/* Render city suggestions */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  updateCity(suggestion); // Update city with selected suggestion
                  setSuggestions([]); // Clear suggestions
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : submitted && city && weather ? (
        <WeatherComponent weather={weather} city={city} aqi={aqi} forecast={forecast} />
      ) : (
        <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
      )}
      <div id="copyright">©Hardiksehgal</div>
    </div>
  );
}

export default App;