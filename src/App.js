import React, { useState, useEffect } from "react";
import Axios from "axios";
import './App.css';
import CityComponent from "./modules/CityComponent";
import WeatherComponent from "./modules/WeatherComponent";


const AppId = "fe4feefa8543e06d4f3c66d92c61b69c";

// function App() {
//   const [city, updateCity] = useState();
//   const [weather, updateWeather] = useState();
//   const [aqi, updateaqi] = useState();
//   const [forecast, updateforecast] = useState();
//   const [loading, setLoading] = useState(false); // State to manage loading
 
//   const fetchWeather = async (e) => {
      

//     e.preventDefault();

//     setLoading(true); // Start loading when the form is submitted
//     const response = await Axios.get(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${AppId}`,
      
//     );
//     try {
//     const lat = response.data.coord.lat;
//     const lon = response.data.coord.lon;
//     const forecast = Axios.get(
//       `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=metric`,
//     );
    
//     console.log(forecast.data);
    
//     const rawData = await  Axios.get(
//       `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`,
//     );
//     // 3 day forecast
    

//     updateWeather(response.data);
//     updateaqi(rawData.data.list[0]);
//     updateforecast(forecast.data);
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//     // Get user's location on component mount
//     useEffect(() => {
//       setLoading(true);
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             // apiCall(latitude, longitude, AppId);
//           },
//           (error) => {
//             console.log("Geolocation is not enabled");
//             console.error(error);
//           }
//         );
//       } else {
//         console.log("Geolocation is not supported by this browser.");
//       }
//     }, []);
//   return (

//     <container id="Container">
//       <span id="AppLabel">Weathernest<lord-icon
//     src="https://cdn.lordicon.com/uvextprq.json"
//     trigger="loop"
//     delay="5000">
//       </lord-icon></span>
//       <form id="SearchBox" onSubmit={fetchWeather}>
//         <input required
//           onChange={(e) => updateCity(" "+e.target.value)}
//           placeholder="Enter City"
//         />
//         <button type={"submit"} ><lord-icon
//     src="https://cdn.lordicon.com/pvbutfdk.json"
//     trigger="hover">
// </lord-icon></button>
//       </form>
//       {city && weather ? (
//         <WeatherComponent weather={weather} city={city} aqi={aqi} forecast={forecast}/>
//       ) : 
     
//        (
//         <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
//       )}
//       <div id="copyright">©Hardiksehgal</div>
//     </container>
    
//   );
// }

function App() {
  const [city, updateCity] = useState("");
  const [weather, updateWeather] = useState(null);
  const [aqi, updateAQI] = useState(null);
  const [forecast, updateForecast] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [submitted, setSubmitted] = useState(false);
  const AppId = "fe4feefa8543e06d4f3c66d92c61b69c"; // Replace with your OpenWeather API key

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted
    setSubmitted(true);

    try {
      const response = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${AppId}&units=metric`
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
      console.log(forecastResponse)
    } catch (error) {
      console.error("Error fetching weather data:", error);
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
    <div id="Container">
      <span id="AppLabel">
        Weathernest
        <lord-icon
          src="https://cdn.lordicon.com/uvextprq.json"
          trigger="loop"
          delay="5000"
        />
      </span>
      <form id="SearchBox" onSubmit={fetchWeather}>
        <input
          required
          onChange={(e) => {
          const value = e.target.value.trim()
          updateCity(value)
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