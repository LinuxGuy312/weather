const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

async function setQuery(evt) {
  if (evt.keyCode == 13) {
    await getResults(searchbox.value);
    searchbox.value = '';
    searchbox.blur()
  }
}

async function getWeather (query) {
  try { resp = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${api.key}`)} catch (error) {document.body.classList.remove('load'); return {'success': false, 'message':"Couldn't get weather data. Make sure your internet is working fine"}}
  const data = (await resp.json())[0];
  try {lat = data.lat} catch (err) {return {'success':false ,"message":`City '${searchbox.value}' not found. Make sure you've spelled it correctly`}};
  const lon = data.lon;
  const weather = await fetch(`${api.base}onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${api.key}`);
  const final_data = await weather.json();
  final_data.name = data.name;
  final_data.country = data.country;
  return {'success':true, 'weather':final_data};
}

async function getResults (query) {
  data = await getWeather(query);
  if (!data.success) {
    return alert(data.message)
  }
  weather = data.weather
  updateWeather(weather);
  updateForecast(weather);
  document.body.classList.remove('load')
}

function updateWeather (weather) {
  let current = weather.current
  document.body.style.backgroundImage = `url(assets/${current.weather[0].icon.slice(-1)}.png)`

  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now)['full'];

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(current.temp)}°c`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerHTML = `<img src="./assets/weather_icons/${current.weather[0].icon}.png" class="weathericon" id="weathericon">${current.weather[0].main}`;
}

function updateForecast (weather) {
  let forecast = weather.daily

  for (let i = 1; i <= 5; i++){
    const currDiv = document.querySelector(`.forecast5 .forecast-${i}`)
    let data = forecast[i]
    let day = dateBuilder(new Date(forecast[i].dt * 1000))['day']
    let temp = Math.round((data.temp.min + data.temp.max)/2)
    let img = data.weather[0].icon
    let weather = data.weather[0].main
    
    let html = `<div class="forecast-day">${day}</div> 
                <div class="forecast-temp">${temp}&deg;c</div>
                <div class="forecast-weather"><img src="./assets/weather_icons/${img}.png" id="forecast-icon">${weather}</div>`
    currDiv.innerHTML = html
  }
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return {'full':`${day}, ${date} ${month} ${year}`, 'day':day};
}

window.onload = getResults('Mumbai')