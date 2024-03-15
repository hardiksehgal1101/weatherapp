import React, { useState } from "react";
import Axios from "axios";
import './App.css';
import CityComponent from "./modules/CityComponent";
import WeatherComponent from "./modules/WeatherComponent";


// const AppId = "fe4feefa8543e06d4f3c66d92c61b69c";
const AppId = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [city, updateCity] = useState();
  const [weather, updateWeather] = useState();
  const [aqi, updateaqi] = useState();
  const [forecast, updateforecast] = useState();
  const fetchWeather = async (e) => {
    e.preventDefault();
    // const response = await Axios.get(
    //   `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${AppId}`,

    // );
    const response = await Axios.get(
      `${apiUrl}/weather?q=${city}&appid=${AppId}`,

    );
    const lat = response.data.coord.lat;
    const lon = response.data.coord.lon;
    const forecast = await Axios.get(
      `${apiUrl}/forecast?lat=${lat}&lon=${lon}&appid=${AppId}&units=metric`,
    );
    console.log(forecast.data);

    const rawData = await Axios.get(
      `${apiUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${AppId}`,
    );
    // 3 day forecast


    updateWeather(response.data);
    updateaqi(rawData.data.list[0]);
    updateforecast(forecast.data);

  };
  return (

    <container id="Container">
      <span id="AppLabel">Weathernest<lord-icon
        src="https://cdn.lordicon.com/uvextprq.json"
        trigger="loop"
        delay="3000">
      </lord-icon></span>
      <form id="SearchBox" onSubmit={fetchWeather}>
        <input required
          onChange={(e) => updateCity(" " + e.target.value)}
          placeholder="Enter City"
        />
        <button type={"submit"} ><lord-icon
          src="https://cdn.lordicon.com/pvbutfdk.json"
          trigger="hover">
        </lord-icon></button>
      </form>
      {city && weather ? (
        <WeatherComponent weather={weather} city={city} aqi={aqi} forecast={forecast} />
      ) :

        (
          <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
        )}
      <div id="copyright">©Hardiksehgal</div>
    </container>

  );
}

export default App;