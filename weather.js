var appId = '11be1aebc2df8499c319245d46873ed9';

var cities = ['Austin', 'Chicago', 'New York', 'Orlando', 'San Fransisco', 'Seattle', 'Denver', 'Atlanta'];

var weatherPath = 'https://api.openweathermap.org/data/2.5/weather';
var forecastPath = 'https://api.openweathermap.org/data/2.5/forecast';

var day = {}
var forecast = {}
var searchedCity = '';
var displayedCity = 'Dallas';

// create weather container for search, nav, and details cards
$("body").append(`<div class="weather-container"></div>`);

//creates html elements 
async function init() {
    await createNav();
    createWeatherDetails();
}

async function searchCity(city) {
    displayedCity = city;
    await retrieveDataForCity(city)
}

// calculate the uv background color
function calculateUVBackground() {
    if (day.sys.type <= 2) {
        return 'good-uv'
    } else if (day.sys.type <= 5) {
        return 'moderate-uv'
    } else if (day.sys.type <= 7) {
        return 'bad-uv'
    } else if (day.sys.type <= 10) {
        return 'extremely-bad-uv'
    }
}
//created the html for the search bar & the statis list of cities
function createNav() {
    // create nav
    $(".weather-container").append(`
        <div class="weather-nav">
            <div class="form-group search-input">
                <input class="form-control search-text-field" placeholder="Search" type="text">
                <button class="search-button btn btn-primary"><img class="medium-icon" src="./assets/search.svg" alt="Search Button"></button>
            </div>
        </div>`)

    $( ".search-text-field" ).keydown(function(e) {
        searchedCity = e.target.value;
    });
    $( ".search-button" ).click(function() {
        searchCity(searchedCity)
    });

// create city-items
    $(".weather-nav").append(`<div class="city-group"></div>`)

// create city list
    cities.forEach((city, i) => {
        $(".city-group").append(`
            <div>
                <div class="card city-item item-${i}">${city}</div>
            </div>
        `)
        $(`.item-${i}`).click(function() {
            searchCity(city)
        });
    })
}
//creates the weather details
function createWeatherDetails() {
    if (day.main) {
        var img = determineWeatherIcon(day.weather[0].main);
        $(".weather-container").append(`
        <div class="weather-details">
            <div class="current-weather card">
                <h3>${displayedCity} <img class="large-icon" src="${img}" alt="weather icon">
                    ${moment().format("MM DD YYYY")}
                </h3>
                <p>Temp: ${day.main.temp}</p>
                <p>Humidity: ${day.main.humidity}</p>
                <p>Wind Speed: ${day.wind.speed}</p>
                <!-- This is probably wrong -->
                <p>Current UV: <span class="${calculateUVBackground()}">${day.sys.type}</span></p>
            </div>
        </div>
    `);
        createFiveDayForecast();
    }
}

// create five day forecast
function createFiveDayForecast() {
        $(".weather-details").append(`<h1>5 Day Forecast</h1><div class="five-day-forecast-container"></div>`);
        forecast.list.forEach(day => {
            var img = determineWeatherIcon(day.weather[0].main)
            $(".five-day-forecast-container").append(`
            <div class="card five-day-item">
                <p>${displayedCity} <img class="large-icon" src="${img}" alt=""></p>
                <p>Temp: ${day.main.temp}</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `)
        });
}

// retrieve data for city typed in or clicked
 async function retrieveDataForCity(city) {
    fetch(`${weatherPath}?q=${city}&appid=${appId}&units=imperial`)
        .then(function(response) { return response.json() }) // Convert data to json
        .then(function(data) {
            day = data;
        })
    // day = dayData.json();
    await fetch(`${forecastPath}?q=${city}&appid=${appId}&units=imperial&cnt=5`)
        .then(function(response) { return response.json() }) // Convert data to json
        .then(function(data) {
            forecast = data;
        })

    $(".weather-container").empty();
    await init();
}
// This will return a string path of the svg you want to load for the weather
function determineWeatherIcon(description) {
    console.log(description);
    switch (description) {
        case 'Clouds':
            return './assets/cloud.svg';
        case 'Sun':
            return './assets/sunny.svg';
        case 'Clear':
            return './assets/sunny.svg';
        case 'Snowy':
            return './assets/snowy.svg';
        case 'Drizzle':
            return './assets/rain.svg';
        case 'Rainy':
            return './assets/rain.svg';
        default:
            return './assets/cloud.svg';
    }
}

retrieveDataForCity(displayedCity)
    .then(() => {
        console.log('Init')
    })