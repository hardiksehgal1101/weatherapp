import React from 'react'
import './CityComponent.css'
import perfectday from "..//icons/4.png"


const CityComponent = (props) => {
  const { updateCity, fetchWeather } = props;
  return (
    <>
      <img id="WeatherLogo" src={perfectday} />
      <span id="ChooseCityLabel">Find Weather of your city</span>
      <form id="SearchBox" onSubmit={fetchWeather}>
        <input
          onChange={(e) => updateCity(e.target.value)}
          placeholder="City"
        />
        <button type={"submit"}>Search</button>
      </form>
    </>
  );
};
export default CityComponent;
