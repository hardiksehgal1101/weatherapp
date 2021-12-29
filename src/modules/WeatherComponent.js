import React,{useState} from "react";
import './WeatherComponent.css'
import pressure from "../icons/dot3.svg"
import AirQuality from "./AirQuality";


const WeatherInfoComponent = (props) => {
    const {name, value} = props;
    return (
        <container id="InfoContainer">
            <img alt="weatherinfologo" id="InfoIcon" src={pressure}/>
            <span id="InfoLabel">
                {value}
                <span>{name}</span>
            </span>
        </container>
    );
};


const WeatherComponent = (props) => {
    let [booten, setbooten] = useState(false);
    const {weather} = props;
    const {aqi} = props; 
    const isDay = weather?.weather[0].icon?.includes('d')
    const getTime = (timeStamp) => {
        return `${new Date(timeStamp * 1000).getHours()} : ${new Date(timeStamp * 1000).getMinutes()}`


    }
    console.log(booten);
    
    return (
        
           <>
           <container id="tempContainer">
                <container id="condition">
                    <span>{`${Math.floor(weather?.main?.temp - 273)}°C`}</span>
                    {`  |  ${weather?.weather[0].description}`}
                </container>
            </container>
            <span id="Location">{`${weather?.name}, ${weather?.sys?.country}`}</span>

            <span id="WeatherInfoLabel">Weather Info</span>
            <container id="WeatherInfoContainer">
                <WeatherInfoComponent name={isDay ? "sunset" : "sunrise"}
                                      value={`${getTime(weather?.sys[isDay ? "sunset" : "sunrise"])}` + " hrs"}/>
                <WeatherInfoComponent name={"humidity"} value={weather?.main?.humidity + " %"}/>
                <WeatherInfoComponent name={"wind"} value={weather?.wind?.speed + " m/s"}/>
                <WeatherInfoComponent name={"pressure"} value={weather?.main?.pressure + " hPa"}/>
                </container>
                <button id="aqiButton" onClick={() => setbooten(true)}>What's the air like?</button>
            {booten ? (<AirQuality aqi={aqi}/>) : null}
            
            </>
            
            
      
        
    );
};

export default WeatherComponent;
