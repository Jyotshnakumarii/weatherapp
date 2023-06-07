const apiKey = "12866b9da24470e567574b4b8ff9bba5";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.querySelector(".card");
const loader = document.querySelector(".loader");


 
async function checkWeather(city) {
  let url;
  if (city) {
    url = `${apiUrl}&q=${city}&appid=${apiKey}`;

  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      url = `${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetchWeather(url);
    }, () => {
      showError("Location is not on");
    });
    return;
  } else {
    showError("Your browser does not support geolocation.");
  }
  fetchWeather(url);
}
async function fetchWeather(url) {
  loader.style.display = "block";
  const response = await fetch(url);
  if (response.status == 404) {
    showError("Location Does Not Exist");
  } else {
    const data = await response.json();
    console.log(data);

    const icon = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="./drive-download-20230607T101452Z-001/${icon}.png">`;

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".climate").innerHTML = data.weather[0].main;

    // Check the current time at the location of the user
    const sunrise = new Date(data.sys.sunrise * 1000).getHours();
    const sunset = new Date(data.sys.sunset * 1000).getHours();
    const currentTime = new Date().getHours();

    // Set the background image based on the current time
    if (currentTime >= sunrise && currentTime < sunset) {
      card.style.backgroundImage = "url('https://tse1.mm.bing.net/th?id=OIP.ci8f4eomFTUBdA0-pUashAHaEr&pid=Api&P=0')";
    } else {
      card.style.backgroundImage = "url('https://tse4.mm.bing.net/th?id=OIP.gm9wo0EddTz4bawjf_H_DwHaE8&pid=Api&P=0')";
    }

    loader.style.display = "none";
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

  }
}

function showError(message) {
  loader.style.display = "none";
  document.querySelector(".error").innerHTML = message;
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather").style.display = "none";

}

// Event listener for search button click

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);

});

//Event Listener for enetr key press in the input

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

checkWeather();