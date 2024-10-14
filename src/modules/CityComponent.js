import React from 'react'
import './CityComponent.css'
import perfectday from "..//icons/main.gif"


const CityComponent = (props) => {
  return (
    <>
      {/*  */}
      
      {/* <form id="SearchBox" onSubmit={fetchWeather}>
        <input 
          onChange={(e) => updateCity(e.target.value)}
          placeholder="Enter City"
        />
        <button type={"submit"}><lord-icon
    src="https://cdn.lordicon.com/pvbutfdk.json"
    trigger="hover">
</lord-icon></button>
      </form> */}
      <img alt="weatherlogo" id="WeatherLogo" src={perfectday} />
    </>
  );
};
export default CityComponent;
