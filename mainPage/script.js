localStorage.clear();
const stack = ['searchPage'] // array for the back button
const resultsPage = document.getElementById('results-page')
const searchPage = document.getElementById('search-page')
const addFavoritesPage = document.getElementById('add-favorites-page')
const editFavoritesPage = document.getElementById('edit-page')
const deleteFavoritesPage = document.getElementById('delete-favorites-page')
const editContainers = document.querySelectorAll('.container')
const parentEditContainer = document.querySelector('.parent-container')
const noFavorites = document.querySelectorAll('.no-favorites')
const parentDelelteContainer = document.getElementById('parent-delete-container')
const deleteContainers = document.querySelectorAll('.delete-container')
const userProfilePage = document.getElementById('user-profile-page');

function getWeather() {
    // to add the resultPage on stach for the back button implementation 
    if (stack[stack.length - 1] !== 'resultsPage')
        stack.push('resultsPage')

    //to hide and show the circular searchin animation when sending request to api
    function hideWhenLoading() {
        const loadingAnimation = document.getElementById('loading-state');
        loadingAnimation.classList.toggle('hidden');
        const hiddenWhenLoad = document.getElementById('hiddenWhenLoad');
        hiddenWhenLoad.classList.toggle('hidden');

    }



    const cityInput = document.getElementById('city');

    const cityHeaderInput = document.getElementById('city-header');
    //changed this one
    const city = cityHeaderInput.value ? cityHeaderInput.value : cityInput.value;

    if (!city) {
        alert('Please enter a city');
        return;
    }



    // Sync input values
    //not necessary
    // if (cityInput && cityHeaderInput) {

    //     cityHeaderInput.value = cityInput.value;
    //     console.log(cityHeaderInput.value);
    // }

    // Show loading state
    const searchPage = document.getElementById('search-page');
    const resultsPage = document.getElementById('results-page');
    if (searchPage && !searchPage.classList.contains('hidden')) {
        searchPage.classList.add('hidden');
        resultsPage.classList.remove('hidden');
    }


    // Hide search bar if visible
    const searchBar = document.getElementById('header-search-bar');
    if (searchBar) {
        searchBar.classList.add('hidden');
    }
    hideWhenLoading();

    // First get city coordinates using Open-Meteo's geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const cityNameEl = document.getElementById('city-name');
    const capitalized = city.charAt(0).toUpperCase() + city.slice(1);
    cityNameEl.textContent = capitalized;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                hideWhenLoading()
                if (localStorage.getItem('validCity')) {
                    cityNameEl.textContent = localStorage.getItem('validCity').charAt(0).toUpperCase() + localStorage.getItem('validCity').slice(1);
                }

                alert("City not found");
                return;
            }
            localStorage.setItem('validCity', city);

            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const cityName = geoData.results[0].name;

            // Fetch current weather with all parameters including daily forecast
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,pressure_msl,visibility,uv_index&hourly=temperature_2m,weathercode,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&forecast_days=10&timezone=auto`;

            // Fetch air quality
            const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

            Promise.all([
                fetch(weatherUrl).then(r => r.json()),
                fetch(aqiUrl).then(r => r.json()).catch(() => ({ current: { us_aqi: null } }))
            ])
                .then(([weatherData, aqiData]) => {
                    hideWhenLoading()
                    displayWeatherData(weatherData, aqiData, cityName, lat, lon);
                })
                .catch(error => {
                    console.error("Error fetching weather:", error);
                    alert("Error fetching weather. Please try again.");
                });
        })
        .catch(error => {
            console.error("Error fetching city data:", error);
            alert("Error fetching city data. Please try again.");
        });
}

function toggleSearch() {
    const searchBar = document.getElementById('header-search-bar');
    if (searchBar) {
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) {
            const input = document.getElementById('city-header');
            if (input) input.focus();
        }
    }
}
//errorChecking2 first line
function goBack() {
    // const searchPage = document.getElementById('search-page');
    // const resultsPage = document.getElementById('results-page');
    const cityHeaderInput = document.getElementById('city-header');

    // // Clear header search when going back
    // if (cityHeaderInput) {
    //     console.log("hleow");
    //     cityHeaderInput.value = '';
    // }

    // // Hide search bar
    // const searchBar = document.getElementById('header-search-bar');
    // if (searchBar) {
    //     searchBar.classList.add('hidden');
    // }

    // searchPage.classList.remove('hidden');
    // resultsPage.classList.add('hidden');

    //to remove
    switch (stack[stack.length - 1]) {
        case 'resultsPage':
            resultsPage.classList.add('hidden')
            cityHeaderInput.value = '';
            stack.pop();
            break;
        case 'addFavoritesPage':
            addFavoritesPage.classList.add('hidden')
            stack.pop()
            break;
        case 'editFavoritesPage':
            editFavoritesPage.classList.add('hidden')
            stack.pop()
            break;
        case 'deleteFavoritesPage':
            deleteFavoritesPage.classList.add('hidden')
            stack.pop()
            break;
        case 'userProfilePage':
            userProfilePage.classList.add('hidden')
            stack.pop()
            break;
        default:
            break;
    }
    // to show
    switch (stack[stack.length - 1]) {
        case 'searchPage':
            console.log(stack[stack.length - 1]);
            console.log(stack);
            searchPage.classList.remove('hidden')
            break;
        case 'addFavoritesPage':
            addFavoritesPage.classList.remove('hidden')

            break;
        case 'resultsPage':
            resultsPage.classList.remove('hidden')
            cityHeaderInput.value = '';
            break;
        case 'editFavoritesPage':
            editFavoritesPage.classList.remove('hidden')

            break;
        case 'deleteFavoritesPage':
            deleteFavoritesPage.classList.remove('hidden')

            break;
        case 'userProfilePage':
            userProfile.classList.remove('hidden')

            break;



        default:
            break;
    }
}

function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: '01d', 1: '02d', 2: '03d', 3: '04d', 45: '50d', 48: '50d',
        51: '09d', 53: '09d', 55: '09d', 56: '09d', 57: '09d',
        61: '10d', 63: '10d', 65: '10d', 66: '13d', 67: '13d',
        71: '13d', 73: '13d', 75: '13d', 77: '13d',
        80: '09d', 81: '09d', 82: '09d',
        85: '13d', 86: '13d',
        95: '11d', 96: '11d', 99: '11d'
    };
    const icon = iconMap[weatherCode] || '01d';
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
        61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
        66: 'Light freezing rain', 67: 'Heavy freezing rain',
        71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        85: 'Slight snow showers', 86: 'Heavy snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[weatherCode] || 'Clear';
}

function calculateSunriseSunset(lat, lon, date = new Date()) {
    // Simple sunrise/sunset calculation (approximate)
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
    const hourAngle = Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
    const sunrise = 12 - (hourAngle * 12 / Math.PI);
    const sunset = 12 + (hourAngle * 12 / Math.PI);

    const sunriseHour = Math.floor(sunrise);
    const sunriseMin = Math.round((sunrise - sunriseHour) * 60);
    const sunsetHour = Math.floor(sunset);
    const sunsetMin = Math.round((sunset - sunsetHour) * 60);

    return {
        sunrise: `${String(sunriseHour).padStart(2, '0')}:${String(sunriseMin).padStart(2, '0')}`,
        sunset: `${String(sunsetHour).padStart(2, '0')}:${String(sunsetMin).padStart(2, '0')}`
    };
}

function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
    return Math.round((b * alpha) / (a - alpha));
}

function displayWeatherData(weatherData, aqiData, cityName, lat, lon) {
    console.log('Weather Data:', weatherData);
    console.log('AQI Data:', aqiData);

    if (!weatherData || !weatherData.current) {
        console.error('Invalid weather data');
        alert('Error: Invalid weather data received');
        return;
    }

    const current = weatherData.current;
    const timezone = weatherData.timezone || 'UTC';
    console.log(timezone);

    // Display main weather info
    displayCurrentWeather(current, cityName, weatherData.daily);

    // Display all details
    const aqiValue = aqiData && aqiData.current ? aqiData.current.us_aqi : null;
    displayWeatherDetails(current, aqiValue, lat, lon);

    // Display hourly forecast
    if (weatherData.hourly) {
        displayHourlyForecast(weatherData.hourly, timezone);
    }

    // Display daily forecast
    if (weatherData.daily) {
        displayDailyForecast(weatherData.daily);
    }
}

function displayCurrentWeather(current, cityName, daily) {
    const tempSection = document.querySelector('.temp-section');
    const cityNameEl = document.getElementById('city-name');
    const weatherCondition = document.getElementById('weather-condition');
    const tempDiv = document.getElementById('temp-div');

    const weatherIcon = document.getElementById('weather-icon');
    const feelsLikeText = document.getElementById('feels-like-text');
    const highLowTemp = document.getElementById('high-low-temp');

    if (!cityNameEl || !weatherCondition || !tempDiv || !weatherIcon || !feelsLikeText || !highLowTemp) {
        console.error('Missing DOM elements');
        return;
    }

    const temp = Math.round(current.temperature_2m || 0);
    const weatherCode = current.weathercode || 0;
    const description = getWeatherDescription(weatherCode);
    const feelsLike = Math.round(current.apparent_temperature || current.temperature_2m || 0);

    cityNameEl.textContent = cityName || 'Unknown';
    weatherCondition.textContent = description;
    tempDiv.innerHTML = `${temp}`;

    weatherIcon.src = getWeatherIcon(weatherCode);
    weatherIcon.style.display = 'block';
    weatherIcon.classList.toggle('hidden');



    feelsLikeText.textContent = `Feels like ${feelsLike}°`;

    if (daily && daily.temperature_2m_max && daily.temperature_2m_max.length > 0) {
        const high = Math.round(daily.temperature_2m_max[0]);
        const low = Math.round(daily.temperature_2m_min[0]);
        highLowTemp.textContent = `High ${high}° · Low ${low}°`;
    } else {
        highLowTemp.textContent = '';
    }
}

function displayWeatherDetails(current, aqi, lat, lon) {
    // Wind Speed
    const windSpeedEl = document.getElementById('wind-speed');
    if (windSpeedEl && current.windspeed_10m !== undefined) {
        const windSpeed = Math.round(current.windspeed_10m * 0.621371); // Convert to mph
        windSpeedEl.textContent = `${windSpeed} mph`;
    }

    // Wind Direction
    const windDirEl = document.getElementById('wind-direction');
    if (windDirEl && current.winddirection_10m !== undefined) {
        const windDir = current.winddirection_10m;
        const direction = getWindDirection(windDir);
        windDirEl.textContent = `From ${direction}`;
    }

    // Sunrise & Sunset
    const sunriseEl = document.getElementById('sunrise-time');
    const sunsetEl = document.getElementById('sunset-time');
    if (sunriseEl && sunsetEl) {
        try {
            const sunTimes = calculateSunriseSunset(lat, lon);
            sunriseEl.textContent = sunTimes.sunrise;
            sunsetEl.textContent = sunTimes.sunset;
        } catch (e) {
            console.error('Error calculating sunrise/sunset:', e);
            sunriseEl.textContent = '--';
            sunsetEl.textContent = '--';
        }
    }

    // UV Index
    const uvIndexEl = document.getElementById('uv-index');
    const uvLabelEl = document.getElementById('uv-label');
    if (uvIndexEl && uvLabelEl) {
        const uvIndex = Math.round(current.uv_index || 0);
        uvIndexEl.textContent = uvIndex;
        const uvLabel = uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : uvIndex <= 10 ? 'Very High' : 'Extreme';
        uvLabelEl.textContent = uvLabel;
    }

    // AQI
    const aqiEl = document.getElementById('aqi');
    const aqiLabelEl = document.getElementById('aqi-label');
    const aqiBarFillEl = document.getElementById('aqi-bar-fill');
    if (aqiEl && aqiLabelEl) {
        if (aqi) { //changed here
            const aqiValue = Math.round(aqi);
            const aqiLabel = getAQILabel(aqiValue);
            aqiEl.textContent = aqiValue;
            aqiLabelEl.textContent = aqiLabel;

            // Update AQI bar
            if (aqiBarFillEl) {
                const aqiPercentage = Math.min((aqiValue / 300) * 100, 100);
                aqiBarFillEl.style.width = `${aqiPercentage}%`;
            }
        } else {
            aqiEl.textContent = '--';
            aqiLabelEl.textContent = 'N/A';
            if (aqiBarFillEl) {
                aqiBarFillEl.style.width = '0%';
            }
        }
    }

    // Visibility
    const visibilityEl = document.getElementById('visibility');
    if (visibilityEl) {
        const visibility = current.visibility;
        if (visibility !== null && visibility !== undefined && !isNaN(visibility)) {
            const visibilityMi = (visibility / 1609.34).toFixed(1); // Convert to miles
            visibilityEl.textContent = `${visibilityMi} mi`;
        } else {
            visibilityEl.textContent = '--';
        }
    }

    // Humidity
    const humidityEl = document.getElementById('humidity');
    const dewPointEl = document.getElementById('dew-point');
    if (humidityEl && current.relativehumidity_2m !== undefined) {
        const humidity = Math.round(current.relativehumidity_2m);
        humidityEl.textContent = `${humidity}%`;

        // Dew Point
        if (dewPointEl && current.temperature_2m !== undefined) {
            const dewPoint = calculateDewPoint(current.temperature_2m, humidity);
            dewPointEl.textContent = `${dewPoint}° Dew point`;
        }
    }

    // Pressure
    const pressureEl = document.getElementById('pressure');
    if (pressureEl && current.pressure_msl !== undefined) {
        const pressure = (current.pressure_msl / 100).toFixed(1); // Convert to mbar
        pressureEl.textContent = pressure.replace('.', ',');
    }
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index] || 'N';
}

function getAQILabel(aqi) {
    if (aqi <= 50) return 'Low air pollution';
    if (aqi <= 100) return 'Moderate air pollution';
    if (aqi <= 150) return 'Unhealthy for sensitive groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very unhealthy';
    return 'Hazardous';
}

function displayHourlyForecast(hourlyData, timezone) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    if (!hourlyForecastDiv || !hourlyData || !hourlyData.time) {
        console.error('Invalid hourly data');
        return;
    }

    const now = new Date();
    const cityTimeStr = now.toLocaleString('en-US', { timeZone: timezone });
    console.log(cityTimeStr);
    const cityTime = new Date(cityTimeStr);

    const currentHour = cityTime.getHours();
    console.log(currentHour);

    let headingHtml = '<div id="hourly-heading">🕐 Hourly forecast</div>';
    let wrapperHtml = '<div class="hourly-forecast-wrapper">';

    const itemCount = Math.min(24, hourlyData.time.length); //this is also not necessary always returns 24
    for (let i = currentHour; i < itemCount + currentHour; i++) { //willl be fixing here too
        if (!hourlyData.time[i]) continue; //this will be removed

        const time = new Date(hourlyData.time[i]);
        if (isNaN(time.getTime())) continue;

        const hour = time.getHours();
        let displayTime;

        if ((hour === currentHour && time.getDate() === cityTime.getDate())) { // will remove the i ===0 from here
            displayTime = 'Now';
        } else {
            if (hour === 0) {
                displayTime = '12 AM';
            } else if (hour < 12) {
                displayTime = `${hour} AM`;
            } else if (hour === 12) {
                displayTime = '12 PM';
            } else {
                displayTime = `${hour - 12} PM`;
            }
        }

        const temperature = hourlyData.temperature_2m && hourlyData.temperature_2m[i] !== undefined
            ? Math.round(hourlyData.temperature_2m[i])
            : '--';
        const weatherCode = hourlyData.weathercode && hourlyData.weathercode[i] !== undefined
            ? hourlyData.weathercode[i]
            : 0;
        const iconUrl = getWeatherIcon(weatherCode);
        const precipChance = hourlyData.precipitation_probability && hourlyData.precipitation_probability[i] !== undefined
            ? hourlyData.precipitation_probability[i]
            : 0;

        const isCurrent = (hour === currentHour && time.getDate() === cityTime.getDate());
        const itemClass = isCurrent ? 'hourly-item current' : 'hourly-item';

        wrapperHtml += `
            <div class="${itemClass}">
                <span>${displayTime}</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>${temperature}°</span>
                ${precipChance > 0 ? `<span>${precipChance}%</span>` : '<span></span>'}
            </div>
        `;
    }

    wrapperHtml += '</div>';
    hourlyForecastDiv.innerHTML = headingHtml + wrapperHtml;
}

function displayDailyForecast(dailyData) {
    const dailyForecastDiv = document.getElementById('daily-forecast');
    if (!dailyForecastDiv || !dailyData || !dailyData.time) {
        console.error('Invalid daily data');
        return;
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let html = '<div id="daily-heading">📅 10-day forecast</div>';

    const itemCount = Math.min(10, dailyData.time.length);
    for (let i = 0; i < itemCount; i++) {
        if (!dailyData.time[i]) continue;

        const date = new Date(dailyData.time[i]);
        if (isNaN(date.getTime())) continue;

        const dayName = i === 0 ? 'Today' : days[date.getDay()];
        const high = dailyData.temperature_2m_max && dailyData.temperature_2m_max[i] !== undefined
            ? Math.round(dailyData.temperature_2m_max[i])
            : '--';
        const low = dailyData.temperature_2m_min && dailyData.temperature_2m_min[i] !== undefined
            ? Math.round(dailyData.temperature_2m_min[i])
            : '--';
        const weatherCode = dailyData.weathercode && dailyData.weathercode[i] !== undefined
            ? dailyData.weathercode[i]
            : 0;
        const iconUrl = getWeatherIcon(weatherCode);
        const precipChance = dailyData.precipitation_probability_max && dailyData.precipitation_probability_max[i] !== undefined
            ? dailyData.precipitation_probability_max[i]
            : 0;

        html += `
            <div class="daily-item">
                <div class="daily-day ${i === 0 ? 'today' : ''}">${dayName}</div>
                <img src="${iconUrl}" alt="Weather Icon" class="daily-icon">
                ${precipChance > 0 ? `<div class="daily-precip">${precipChance}%</div>` : '<div class="daily-precip"></div>'}
                <div class="daily-temps">
                    <span class="daily-high">${high}°</span>
                    <span class="daily-low">${low}°</span>
                </div>
				
            </div>
        `;
    }

    dailyForecastDiv.innerHTML = html;
}

const circleDiv = document.querySelector('.circle');
const sections = document.querySelectorAll('.section');
const sectionContainer = document.querySelector('.sectionContainer');
const closeCircle = document.querySelector('.closeCircle');
circleDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    sectionContainer.classList.remove('hidden');
    circleDiv.classList.add('active');
    // console.log("helo");

    // for the content to appear after some delay
    setTimeout(() => {
        sections.forEach(section => {
            section.classList.remove('hidden');



        })
    }, 100);
    setTimeout(() => {
        sections.forEach(section => {

            section.classList.add('activeSection');


        })
    }, 150);

})
closeCircle.addEventListener('click', (e) => {
    closeBurgerMenu(e)
    // console.log("clicked");
})
document.body.addEventListener('click', (e) => {
    closeBurgerMenu(e);
    // console.log("clicked boood");
})
function closeBurgerMenu(e) {


    if (circleDiv.classList.contains('active')) {
        circleDiv.classList.remove('active');


        sectionContainer.classList.add('hidden')
        e.stopPropagation();

        sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('activeSection');

        })
    }
}
sections.forEach(section => {
    section.addEventListener('click', (e) => {
        e.stopPropagation;
    })

});
function validateCityName(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const objData = fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {


                // alert("City not found");
                return;
            }

            console.log(geoData);
            return geoData;
        })
        .catch(e => {
            alert('error from line 649')
            return
        })
    return objData;
}


//adding event listners on add-favorites button/feature
const addFavorites = document.getElementById('add-favorites')
const mainPage = document.getElementById('search-page')
const favoriteInput = document.getElementById('favorite-input')
const favoriteSearchButton = document.getElementById('favorite-search-button')

const favoriteBack = document.getElementById('favorite-back')
addFavorites.addEventListener('click', e => {
    stack.push('addFavoritesPage')
    e.stopPropagation();
    mainPage.classList.add('hidden')
    // console.log(addFavoritesPage);
    addFavoritesPage.classList.remove('hidden')
    // favoriteBack.classList.remove('hidden')





})
favoriteSearchButton.addEventListener('click', e => {
    if (!favoriteInput.value) {
        // console.log(favoriteInput);
        console.log(favoriteInput.value);
        alert('enter a city name')
        return;
    }
    const addFavLoading = document.getElementById('add-fav-loading')
    addFavLoading.classList.remove('hidden')
    validateCityName(favoriteInput.value)
        .then((result) => {

            if (result) {
                console.log(result['results'][0]['name']);
                fetch('addFavorites.php', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        city: result['results'][0]['name']

                    })
                })
                    .then(res => res.json())
                    .then(result => {
                        addFavLoading.classList.add('hidden')

                        if (result.status === 'success') {
                            console.log("the result of the city is", result.city);
                            alert(`Succesfully added ${result.city}`)
                            showFavorites()
                            showFavoritesOnPage(parentEditContainer, editContainers)
                            showFavoritesOnPage(parentDelelteContainer, deleteContainers)

                        }
                        else if (result.status === 'alreadyExists')
                            alert(`${result.city} already exists`)
                        else if (result.status === 'limitReached')
                            alert(`favorite widget limit reached`)
                        else
                            alert('Please enter a valid city name')


                    })
            }
            else {
                alert("Eror city not found")
                addFavLoading.classList.add('hidden')
            }
        })
        .catch(e => {
            alert('error adding favorites please try again')
            addFavLoading.classList.add('hidden')

        })

})



let count = 0;
//to get favorites details
function getFavoriteCities() {
    const result = fetch('favoriteCities.php')
        .then(res => res.json())
        .then(result => result)

        .catch(e => {
            alert("error from line 743")
        })
        console.log(result);
    return result
}

function showWidgetDetails(cityNames, latitude, longitude) {

    const favoriteWidget1 = document.getElementById('favorite-widget1')
    const favoriteWidget2 = document.getElementById('favorite-widget2')
    let count = 0
    if (cityNames) {
        count = cityNames.length;
    }
    else {
        let maxAllowed = 2;
        for (let index = 0; index < maxAllowed; index++) {
            const element = document.getElementById(`favorite-widget${index + 1}`);
            // console.log(element);    
            element.classList.add('hidden')

        }
        return
    }
    if (count) {


        if (count >= 1 && count < 3) {
            favoriteWidget1.classList.remove('hidden')
            favoriteWidget2.classList.add('hidden')
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude[0]}&longitude=${longitude[0]}&current=temperature_2m&forecast_days=1`
            fetch(url)
                .then(res => res.json())
                .then(result => {
                    favoriteWidget1.children[0].textContent = removeUnwanted(cityNames[0]);

                    favoriteWidget1.children[1].textContent = `${result.current.temperature_2m}°`

                })
                .catch(e => alert("error from the fucing"))

        }
        if (count === 2) {
            favoriteWidget2.classList.remove('hidden')
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude[1]}&longitude=${longitude[1]}&current=temperature_2m&forecast_days=1`
            fetch(url)
                .then(res => res.json())
                .then(result => {
                    favoriteWidget2.children[0].textContent = removeUnwanted(cityNames[1]);

                    favoriteWidget2.children[1].textContent = `${result.current.temperature_2m}°`

                })
                .catch(e => alert("error from line 795"))

        }

    }
}

function showFavorites() {
    const result = getFavoriteCities()
        .then(result => {
            // console.log("object");
            if (result && result.status === "success") {
                showWidgetDetails(result.city, result.latitude, result.longitude)
                return result
            }
            if (result && result.status === "noFavorites") {
                showWidgetDetails()

            }

        })
        .catch(e => {
            console.log(e);
            alert('error in showing favorites')

        })
    return result
}

showFavorites() // to show the favorites widget 

// edit functionality
const editFavorites = document.getElementById('edit-favorites')

// to push into stack for the back button to work
editFavorites.addEventListener('click', e => {
    // e.stopPropagation();
    editFavoritesPage.classList.remove('hidden')
    searchPage.classList.add('hidden')
    stack.push('editFavoritesPage')

})

//to display favorite cities in edit page if any exists
showFavoritesOnPage(parentEditContainer, editContainers)




//for the functionality if anyone wants to edit their favorites
editContainers.forEach(editContainer => {
    const replaceDiv = editContainer.children[0]
    const loadingEl = editContainer.children[1]
    const editBtn = editContainer.children[2]

    // console.log(editBtn);
    editContainer.children[2].addEventListener('click', e => {
        let replaceInput = document.createElement('input')
        function saveAndCheckEdit() {
            replaceInput = editContainer.children[0]
            editBtn.classList.remove('done-btn')
            editBtn.innerHTML = "Edit"
            if (replaceDiv.innerText.toLowerCase() === replaceInput.value.toLowerCase()) {
                //to not fetch and loading state if the value are same
                document.activeElement.blur()
                editContainer.replaceChild(replaceDiv, replaceInput)
                return

            }
            editBtn.classList.add('cooldown')
            replaceInput.classList.add('hidden')
            loadingEl.classList.remove('hidden')

            fetch('editFavorites.php', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    city: replaceInput.value,
                    oldCity: replaceDiv.innerText

                })
            })
                .then(res => res.json())
                .then(result => {
                    if (result.status === 'success') {

                        replaceDiv.innerText = result.city;
                        showFavorites()
                        showFavoritesOnPage(parentDelelteContainer, deleteContainers)

                        alert('Successfully Updated');
                    }
                    else if (result.status === 'sameCity') {
                        alert('Please change the city')
                    }
                    else if (result.status === 'alreadyExists') {
                        alert(`${replaceInput.value} already exists`)
                    }
                    else if (result.status === 'notFound') {
                        alert('City not found')
                    }
                    else alert('Error updating the favorites')
                    console.log(result.status);
                    replaceInput.classList.remove('hidden')
                    loadingEl.classList.add('hidden')
                    document.activeElement.blur()
                    editContainer.replaceChild(replaceDiv, replaceInput)
                    editBtn.classList.remove('cooldown')

                })
                .catch(e => {
                    alert('error editing favorites')
                    console.log(e.status);
                    loadingEl.classList.add('hidden')
                    editBtn.classList.remove('cooldown')
                    document.activeElement.blur()
                    editContainer.replaceChild(replaceDiv, replaceInput)

                })
            // console.log(document.activeElement);


            // console.log("object");
            return;
        }
        if (editBtn.classList.contains('done-btn')) {
            saveAndCheckEdit()
            return
        }
        console.log("hello onh");
        editBtn.innerHTML = `&#10003;`
        editBtn.classList.add('done-btn')
        replaceInput.classList.add('edit-input')
        replaceInput.value = replaceDiv.innerText;
        editContainer.replaceChild(replaceInput, replaceDiv)
        replaceInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                saveAndCheckEdit()
            }
        })
        replaceInput.focus()

    })
})


function removeUnwanted(str = "hello there") {
    // to trim some characters if it doesn't fit the widget
    let count = 0;
    let newStr = ''
    for (let index = 0; index < str.length; index++) {
        if (str[index] === " ")
            count++;
        if (index === 13)
            break;
        if (count === 2)
            return newStr
        newStr += str[index]

    }
    return newStr
}
function showFavoritesOnPage(parentContainer, containers) {
    getFavoriteCities()
        .then(result => {
            // console.log(result, "from line 764");
            if (result && result.status === "success") {
                parentContainer.classList.remove('hidden');
                noFavorites.forEach(element => {
                    element.classList.add('hidden')
                })
                let maxAllowed = 2

                // let i = 0;
                // result.city.forEach(element => {
                //     const container = containers[i]
                //     container.classList.remove('hidden')
                //     container.children[0].innerText = element;
                //     i++;
                // })
                for (let i = 0; i < maxAllowed; i++) {
                    const container = containers[i]
                    const element = result.city[i]
                    if (i < result.city.length) {
                        container.classList.remove('hidden')
                        container.children[0].innerText = element;
                    }
                    else
                        container.classList.add('hidden')



                }
            }
            else if (result && result.status === "noFavorites") {
                parentContainer.classList.add('hidden');
                noFavorites.forEach(element => {
                    element.classList.remove('hidden')
                })
            }
        })
        .catch(e => {
            console.log(e);
            alert('error showing the data')
        })
}

//below code is for the delete page

const deleteFavorites = document.getElementById('delete-favorites')
deleteFavorites.addEventListener('click', () => {
    stack.push('deleteFavoritesPage')
    searchPage.classList.add('hidden')
    deleteFavoritesPage.classList.remove('hidden')

})

//to show favorites in delete page if exists
showFavoritesOnPage(parentDelelteContainer, deleteContainers)

//for the delete functionality
const deleteAlertPage = document.getElementById('delete-alert-page');
const deleteAlertContainer = document.querySelector('.child-alert-container');
const cancelAlert = document.getElementById('cancel')
const deleteFavoritesBtn = document.getElementById('delete')
let cityName = ''
let toLoad = null
let targetedFavoriteCityDiv = null

cancelAlert.addEventListener('click', e => {
    deleteAlertPage.classList.add('hidden')
    deleteAlertContainer.classList.remove('alert-after')
})

//for the delete button functionality and to show the delete alert
deleteContainers.forEach(container => {
    const deleteBtn = container.children[2]
    const loadingState = container.children[1]
    const favoriteCityDiv = container.children[0]
    deleteBtn.addEventListener('click', e => {
        cityName = favoriteCityDiv.innerText
        toLoad = loadingState
        targetedFavoriteCityDiv = favoriteCityDiv
        deleteAlertPage.classList.remove('hidden')
        setTimeout(() => {
            deleteAlertContainer.classList.add('alert-after')

        })
    })


})
deleteFavoritesBtn.addEventListener('click', e => {
    deleteAlertPage.classList.add('hidden')
    deleteAlertContainer.classList.remove('alert-after')
    toLoad.classList.remove('hidden')
    targetedFavoriteCityDiv.classList.add('hidden')
    deleteFavoritesPerm(cityName, toLoad, targetedFavoriteCityDiv)

})

//to delete favorites on database
function deleteFavoritesPerm(cityName, loadingEl, favoriteCityDiv) {
    fetch('deleteFavorites.php', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            city: cityName

        })

    })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'success') {
                alert('Deletion Successfull')
                showFavoritesOnPage(parentDelelteContainer, deleteContainers)
                showFavoritesOnPage(parentEditContainer, editContainers)
                showFavorites()
            }
            else {
                alert('Deletion Failure')
                console.log(result.status);
                console.log(result.city);


            }
            loadingEl.classList.add('hidden')
            favoriteCityDiv.classList.remove('hidden')

        })
        .catch(e => {
            alert('Error in Deletion..')
            loadingEl.classList.add('hidden')
            favoriteCityDiv.classList.remove('hidden')
        })
}

// for user profile page
const userProfile = document.getElementById('user-profile')
userProfile.addEventListener("click", e => {
    stack.push('userProfilePage')
    userProfilePage.classList.remove('hidden')
    searchPage.classList.add('hidden')

})