import React,{useState} from "react";
import './WeatherComponent.css'
import AirQuality from "./AirQuality";

const WeatherIcons = {
    "01d": "../icons/sunny.png",
    "01n": "../icons/night.png",
    "02d": "../icons/day.png",
    "02n": "../icons/cloudy-night.png",
    "03d": "../icons/cloudy.png",
    "03n": "../icons/cloudy.png",
    "04d": "../icons/perfect-day.png",
    "04n": "../icons/cloudy-night.png",
    "09d": "../icons/rain.png",
    "09n": "../icons/rain-night.png",
    "10d": "../icons/rain.png",
    "10n": "../icons/rain-night.png",
    "11d": "../icons/storm.png",
    "11n": "../icons/storm.png"
  };

  const WeatherInfoIcons = {
    sunset: "../icons/temp.svg",
    sunrise: "../icons/temp.svg",
    humidity: "../icons/humidity.svg",
    wind: "../icons/wind.svg",
    pressure: "../icons/pressure.svg",
    temperature: "../icons/temperature.svg",
};

const WeatherInfoComponent = (props) => {
    const {name, value} = props;
    return (
        <container id="InfoContainer">
            <img alt="weatherinfologo" id="InfoIcon" src={WeatherInfoIcons[name]}/>
            <span id="InfoLabel">
                {value}
                <span>{name}</span>
            </span>
        </container>
    );
};


const WeatherComponent = (props) => {
    let [booten, setbooten] = useState(false);
    const { updateCity, fetchWeather } = props;
    const {weather} = props;
    const {aqi} = props;
    const isDay = weather?.weather[0].icon?.includes('d')
    const getTime = (timeStamp) => {
        return `${new Date(timeStamp * 1000).getHours()} : ${new Date(timeStamp * 1000).getMinutes()}`


    }
    const icon = weather.weather[0].icon;


    
    return (
        
           <>
           <container id="tempContainer">
                <container id="condition">
                    <span className="temperature">{`${Math.floor(weather?.main?.temp - 273)}°C`}</span>
                    <div className="weather-desc">
                    {`${weather?.weather[0].description}`}
                    <img className="side-icon" src={WeatherIcons[icon]}/></div>
                </container>
                
            </container>
            

            <span id="Location">{`${weather?.name}, ${weather?.sys?.country}`}</span>

            
            <container id="WeatherInfoContainer">
                <WeatherInfoComponent name={isDay ? "sunset" : "sunrise"}
                                      value={`${getTime(weather?.sys[isDay ? "sunset" : "sunrise"])}` + " hrs"}/>
                <WeatherInfoComponent name={"humidity"} value={weather?.main?.humidity + " %"}/>
                <WeatherInfoComponent name={"wind"} value={weather?.wind?.speed + " m/s"}/>
                <WeatherInfoComponent name={"pressure"} value={weather?.main?.pressure + " hPa"}/>
                </container>
                <button id="aqiButton" onClick={() => setbooten(true)}>What's the air like <lord-icon
    src="https://cdn.lordicon.com/njjuilvq.json"
    trigger="loop"
    delay="1000">
</lord-icon></button>
                {booten ? (<AirQuality aqi={aqi}/>) : null}
            
            </>
            
            
      
        
    );
};

export default WeatherComponent;
