const apiKey = "12866b9da24470e567574b4b8ff9bba5";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast/?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.querySelector(".card");
const loader = document.querySelector(".loader");
const hourlyForecastContainer = document.querySelector(".hourly-forecast");

async function checkWeather(city) {
  let url;
  if (city) {
    url = `${apiUrl}&q=${city}&appid=${apiKey}`;
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        url = `${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
        fetchWeather(url);
      },
      () => {
        showError("Location is not available");
      }
    );
    return;
  } else {
    showError("Your browser does not support geolocation.");
  }
  fetchWeather(url);
}

async function fetchWeather(url) {
  loader.style.display = "block";
  try {
    const response = await fetch(url);
    if (response.status == 404) {
      showError("Location Does Not Exist");
    } else {
      const data = await response.json();
      console.log(data);

      const currentWeather = data.list[0];
      const icon = currentWeather.weather[0].icon;
      weatherIcon.innerHTML = `<img src="./drive-download-20230607T101452Z-001/${icon}.png">`;

      document.querySelector(".city").innerHTML = data.city.name;
      document.querySelector(".temp").innerHTML = Math.round(currentWeather.main.temp) + "°C";
      document.querySelector(".climate").innerHTML = currentWeather.weather[0].main;

      const sunrise = new Date(currentWeather.sys.sunrise * 1000).getHours();
      const sunset = new Date(currentWeather.sys.sunset * 1000).getHours();
      const currentTime = new Date().getHours();

      if (currentTime >= sunrise && currentTime < sunset) {
        card.style.backgroundImage =
          "url('https://tse1.mm.bing.net/th?id=OIP.ci8f4eomFTUBdA0-pUashAHaEr&pid=Api&P=0')";
      } else {
        card.style.backgroundImage =
          "url('https://tse4.mm.bing.net/th?id=OIP.gm9wo0EddTz4bawjf_H_DwHaE8&pid=Api&P=0')";
      }

      displayHourlyForecast(data.list);
      loader.style.display = "none";
      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    }
  } catch (error) {
    console.error('Error:', error);
    showError("An error occurred. Please try again later.");
  }
}

function displayHourlyForecast(forecastList) {
  hourlyForecastContainer.innerHTML = "";
  forecastList.slice(0, 8).forEach((forecast) => {
    const hour = new Date(forecast.dt * 1000).getHours();
    const icon = forecast.weather[0].icon;
    const temp = Math.round(forecast.main.temp);

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
      <div class="forecast-hour">${hour}:00</div>
      <div class="forecast-icon"><img src="./drive-download-20230607T101452Z-001/${icon}.png"></div>
      <div class="forecast-temp">${temp}°C</div>
    `;

    hourlyForecastContainer.appendChild(forecastItem);
  });
}

function showError(message) {
  loader.style.display = "none";
  document.querySelector(".error").innerHTML = message;
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather").style.display = "none";
}

function updateWeatherHourly() {
  const city = searchBox.value;
  checkWeather(city);
}

// Call updateWeatherHourly function initially and every hour
updateWeatherHourly();
setInterval(updateWeatherHourly, 3600000); // 1 hour = 3600000 milliseconds

// Event listener for search button click
searchBtn.addEventListener("click", updateWeatherHourly);

// Event Listener for enter key press in the input
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    updateWeatherHourly();
  }
});
