import React from 'react'
import './CityComponent.css'
import perfectday from "..//icons/main.gif"


const CityComponent = (props) => {
  return (
    <>
      <img alt="weatherlogo" id="WeatherLogo" src={perfectday} />
    </>
  );
};
export default CityComponent;
