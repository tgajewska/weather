const countriesSelect = document.getElementById('countries');
const form = document.getElementById('form');
const loader = document.getElementById("loader");
const output = document.getElementById("output");

window.onload = function() {
  loadCountriesCodes();
  getUsersChoice();
}

function loading() {
  if (!loader.classList.contains("visible")) {
    loader.classList.add("visible");
  }
}

function stopLoading() {
  if (loader.classList.contains("visible")) {
    loader.classList.remove("visible");
  }
}

function getUsersChoice() {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const usersChoice = document.querySelector('input[name="miasto"]').value;
    const country = document.querySelector('select[name="country"]').value;
    const regCity  = /^([a-zA-Z]+[\-]?\s?[a-zA-Z]+)+$/;

    if (regCity.test(usersChoice)) {
      loading();
      cleanOldResults();
      var urlWeather = 'http://api.openweathermap.org/data/2.5/forecast?q=' + usersChoice;

      if (country === 'państwo') {
        loadWeatherData(urlWeather, country);
      }
      else {
        loadCode(urlWeather, country);
      }
    }
    else {
      alert('Ups! Wystąpił błąd. Czy na pewno wpisałeś poprawnie nazwę miasta?')
    }
  })
}

function loadCode(urlWeather, country) {
  const request = new XMLHttpRequest;
  const urlCountry = 'https://restcountries.eu/rest/v2/name/' + country;
  request.open("get", urlCountry, true);
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      const data = JSON.parse(request.responseText);
      var code = data[0].alpha2Code;
      urlWeather += ',' + code;
      loadWeatherData(urlWeather);
    }
  }
}


function loadWeatherData(urlWeather) {
  const url = urlWeather +
  '&units=metric&lang=pl&APPID=7b4b8f718de226945108261490b7475c';

  fetch(url)
  .then(resJSON)
  .then(myData => displayWeather(myData))
  .catch(error => handleErrors(error))
}


function loadCountriesCodes() {
  fetch('https://restcountries.eu/rest/v2/all')
  .then(response => resJSON(response))
  .then(data => displayCountriesList(data))
  .catch(error => handleErrors(error))
}


function displayCountriesList(data) {
  for(index in data) {
    const option = document.createElement('option');
    option.innerHTML = data[index].name;
    countriesSelect.appendChild(option);
  }
}

function handleErrors(error) {
  stopLoading();
  output.innerHTML = "Coś poszło nie tak. Nie możemy pobrać pogody dla tej miejscowości. Sprawdź, czy na pewno poprawnie dopasowałeś państwo do miasta lub spróbuj później.";
}

function resJSON(response){
  return response.json();
}

function displayWeather(data) {
  const city = document.getElementById("cityName");
  const text = document.getElementById("weatherDescription");
  cityName.innerHTML = data.city.name + ", " + data.city.country;
  loadIcon(data);
  text.innerHTML = Math.round(data.list[0].main.temp) + ' st. C, ' + data.list[0].weather[0].description;
  stopLoading();
}

function loadIcon(data) {
  var iconcode = data.list[0].weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  var iconDiv = document.getElementById('icon');
  var iconOnWww = document.createElement('img');
  iconOnWww.src = iconUrl;
  iconOnWww.alt = 'icon';
  iconDiv.appendChild(iconOnWww);
}

function cleanOldResults() {
  document.getElementById("weatherDescription").innerHTML = '';
  document.getElementById("icon").innerHTML = '';
}
