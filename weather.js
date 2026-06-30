
const API_KEY = "3a9f3cc20c474817841172658262806";
const API_URL = "https://api.weatherapi.com/v1/forecast.json";
let locationInput = document.getElementById("location_search");
let locationButton = document.getElementById("search_location_button");
let locationDetails = document.getElementById("location-details");
let tempDetails = document.getElementById("temp-details");
let feelsLikeDetails = document.getElementById("feels-like");
let humidityDetails = document.getElementById("humidity");
let windDetails = document.getElementById("wind");
let precipitationDetails = document.getElementById("precipitation");
let hourlyWeatherDetails = document.getElementById("hourly-weather");
let dailyWeatherDetails = document.getElementById("daily-weather");
let result;
let hourlyResult;
let hourlyResultList;
let dailyResult;
let dailyResultList;
let dailyHtmlHolder;

locationButton.addEventListener("click", () => {
    searchLocationData(locationInput.value);
});


async function loadDefaultWeather(){
    let currentLocation;
   navigator.geolocation.getCurrentPosition( (position)=> {
       currentLocation = `${position.coords.latitude},${position.coords.longitude}` || localStorage.getItem("default_location");
       localStorage.setItem("default_location",currentLocation); 
       searchLocationData(currentLocation);
    }
);
}

async function searchLocationData(location){

   try{
      let response = await fetch(API_URL+"?key="+API_KEY+"&q="+location+"&days="+7);

      if(!response.ok){
         throw new Error(`http Error : ${response.status}`)
      }

       result = await response.json();
      
       if(result){
        localStorage.setItem("lastCheckedLocation",JSON.stringify(result));
        displayAllBlock();
       }else{
            throw new Error(`Error displaying location weather`);
       }

   }catch(error){
        alert(error);
        loadOfflineDetails();
   }

}

function loadOfflineDetails(){

    let getLastSavedLocation = localStorage.getItem("lastCheckedLocation")
    if(getLastSavedLocation !== null){
        result = JSON.parse(getLastSavedLocation);
        displayAllBlock();
    }

}

function displayAllBlock(){
    displayLocationInformation();
    displayTempInformation();
    displayFeelsLikeDetails();
    displayHourlyWeather();
    dailyWeather();
}

function displayLocationInformation(){
  locationDetails.innerHTML= `
    <h2 class="text-4xl font-bold mb-2">
      ${result.location.name} , ${result.location.country}
    </h2>
    <p class="text-gray-200">
       Tuesday, Aug 5, 2025
    </p>
   `;
}

function displayTempInformation(){
    tempDetails.innerHTML = `

        <img src="https:${result.current.condition.icon}" width="50" height"50" />
        <h1 class="text-7xl font-bold">
            ${result.current.temp_c}°
        </h1>
    `;
}

function displayFeelsLikeDetails(){
    feelsLikeDetails.innerHTML = result.current.feelslike_c+" &deg;";
    humidityDetails.innerText = result.current.humidity+"%";
    windDetails.innerText = result.current.wind_kph + "km/h";
    precipitationDetails.innerText = result.current.precip_mm + "mm";
}

function changeTimeToDay(timeValue){
const date = new Date(timeValue * 1000);

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const currentDayIndex = date.getDay();
return days[currentDayIndex];
}

function displayHourlyWeather(){
    hourlyResult = result.forecast.forecastday[0].hour;
    hourlyResultList = "";
    for(let i = 0; i <= 6; i++){
        let currentTime = hourlyResult[i].time.split(" ")[1];
        //console.log(currentHour);
        
        hourlyResultList += `
        <div class="bg-[#2C295F] rounded-lg p-4 flex justify-between">
            <span><i class="fa-solid fa-cloud mr-2"></i>${currentTime} ${amOrPm(currentTime)} </span>
            <span>${hourlyResult[i].temp_c}°</span>
        </div>`;
    }
    hourlyWeatherDetails.innerHTML = hourlyResultList;
}

function dailyWeather(){
    dailyResultList = result.forecast.forecastday;
    dailyHtmlHolder = "";
    dailyResultList.forEach( (dailyResult) => {

        dailyHtmlHolder += `
        <div class="bg-[#1D1B4B] rounded-xl p-4 text-center">
            <p>${changeTimeToDay(dailyResult.date_epoch)}</p>
            <img src="https:${dailyResult.day.condition.icon}" width="50" height="50">
            <p>${dailyResult.day.maxtemp_c}° / ${dailyResult.day.mintemp_c}°</p>
        </div>` ;
    });
    dailyWeatherDetails.innerHTML =dailyHtmlHolder;
}

function amOrPm(currentTime){
    let splitTime = currentTime.split(":")[0];

    if(splitTime == 0){
        return ""
    }else if(splitTime <= 11){
        return "Am";
    }else{
        return "Pm"
    }

}
loadDefaultWeather();

//        <i class="fa-solid fa-sun text-yellow-300 text-5xl mb-4"></i>