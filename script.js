window.onload = function() {
  getUsersChoice();
}

function getUsersChoice() {
  var form = document.getElementById('form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var usersChoice = document.querySelector('input[name="miasto"]').value;
    const regCity  = /^([a-zA-Z]+[\-]?\s?[a-zA-Z]+)+$/;
    if (regCity.test(usersChoice))
    {cleanOldResults();
    loadData(usersChoice);}
    else {alert('Ups! Wystąpił błąd. We wpisanej przez ciebie nazwie występują niedozwolone znaki.')}

  })
}

function cleanOldResults(output) {
  document.getElementById("weatherDescription").innerHTML = '';
  document.getElementById("icon").innerHTML = '';
}

function loadData(city) {
  const url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&lang=pl&APPID=7b4b8f718de226945108261490b7475c';
  fetch(url)
  .then(resJSON)
  .then(myData => handleData(myData))
  .catch(error => alert('Ups! Wystąpił błąd. Czy na pewno wpisałeś poprawną nazwę miasta?'))
}
function resJSON(response){
  return response.json()
}

function handleData(data) {
  const text = document.getElementById("weatherDescription");
  loadIcon(data);
  text.innerHTML = Math.round(data.list[0].main.temp - 273.15) + ' st. C., ' + data.list[0].weather[0].description;
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
