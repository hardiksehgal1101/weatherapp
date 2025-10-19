import React from 'react'
// import pressure from '../../src/icons/bullet.png'

// const WeatherInfoComponent = (props) => {
//   const {name, value} = props;
//   return (
//       <container id="InfoContainer">
//           <img alt="aqiinfologo" id="InfoIcon" src={pressure}/>
//           <span id="InfoLabel">
//               {value}
//               <span>{name}</span>
//           </span>
//       </container>
//   );
// };

const AirQuality = (props) =>{
  const {aqi} = props; 
    return (
        <>
        <div id="aqcondition">
        {(() => {
  
  switch (aqi?.main?.aqi) {
     case 1:
         return (
           <div id="good">Healthy Air</div>
         )
    case 2:
         return (
           <div id="satisfactory">Acceptable Air</div>
         )
    case 3:
         return (
           <div id="moderate">Watch out!</div>
         )
    case 4:
         return (
           <div id="poor">Unhealthy Air</div>
         )
         
     case 5:
         return (
           <div id="verypoor">Hazardous Air</div>
         )
         case 6:
         return (
           <div id="severe">Severe Danger</div>
         )
     default:
         return (
           <div>AQI Unavailable</div>
         )
  }

})()}</div>

        {/* <container id="aqInfoContainer">
            <WeatherInfoComponent name={"Carbon Monoxide"}
                                  value={aqi?.components?.co + " µg/m³"}/>
            <WeatherInfoComponent name={"ammonia"} value={aqi?.components?.nh3 + " µg/m³"}/>
            <WeatherInfoComponent name={"Nitrogen Dioxide"} value={aqi?.components?.no2 + " µg/m³"}/>
            <WeatherInfoComponent name={"Ozone"} value={aqi?.components?.o3 + " µg/m³"}/>
            <WeatherInfoComponent name={"PM 10"} value={aqi?.components?.pm10 + " µg/m³"}/>
            <WeatherInfoComponent name={"PM 2.5"} value={aqi?.components?.pm2_5 + " µg/m³"}/>
        </container> */}
      </>
    )
}

export default AirQuality;

