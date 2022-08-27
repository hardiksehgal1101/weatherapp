import React from 'react'
import './CityComponent.css'
import perfectday from "..//icons/4.png"


const CityComponent = (props) => {
  const { updateCity, fetchWeather } = props;
  return (
    <>
      {/*  */}
      <span id="ChooseCityLabel">Find Weather of your city</span>
      
      <form id="SearchBox" onSubmit={fetchWeather}>
        <input 
          onChange={(e) => updateCity(e.target.value)}
          placeholder="Enter City"
        />
        <button type={"submit"}><lord-icon
    src="https://cdn.lordicon.com/pvbutfdk.json"
    trigger="hover">
</lord-icon></button>
      </form>
      <img alt="weatherlogo" id="WeatherLogo" src={perfectday} />
    </>
  );
};
export default CityComponent;
