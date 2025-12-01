function getWeather() {
    const cityInput = document.getElementById('city');
    const cityHeaderInput = document.getElementById('city-header');
    const city = cityInput ? cityInput.value : (cityHeaderInput ? cityHeaderInput.value : '');

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Sync input values
    if (cityInput && cityHeaderInput) {
        cityHeaderInput.value = cityInput.value;
    }

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

    // First get city coordinates using Open-Meteo's geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                alert("City not found");
                return;
            }

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

function goBack() {
    const searchPage = document.getElementById('search-page');
    const resultsPage = document.getElementById('results-page');
    const cityHeaderInput = document.getElementById('city-header');
    
    // Clear header search when going back
    if (cityHeaderInput) {
        cityHeaderInput.value = '';
    }
    
    // Hide search bar
    const searchBar = document.getElementById('header-search-bar');
    if (searchBar) {
        searchBar.classList.add('hidden');
    }
    
    searchPage.classList.remove('hidden');
    resultsPage.classList.add('hidden');
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
    
    // Display main weather info
    displayCurrentWeather(current, cityName, weatherData.daily);
    
    // Display all details
    const aqiValue = aqiData && aqiData.current ? aqiData.current.us_aqi : null;
    displayWeatherDetails(current, aqiValue, lat, lon);
    
    // Display hourly forecast
    if (weatherData.hourly) {
        displayHourlyForecast(weatherData.hourly);
    }
    
    // Display daily forecast
    if (weatherData.daily) {
        displayDailyForecast(weatherData.daily);
    }
}

function displayCurrentWeather(current, cityName, daily) {
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
        if (aqi !== null && aqi !== undefined && !isNaN(aqi)) {
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

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    if (!hourlyForecastDiv || !hourlyData || !hourlyData.time) {
        console.error('Invalid hourly data');
        return;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    
    let headingHtml = '<div id="hourly-heading">🕐 Hourly forecast</div>';
    let wrapperHtml = '<div class="hourly-forecast-wrapper">';
    
    const itemCount = Math.min(24, hourlyData.time.length);
    for (let i = 0; i < itemCount; i++) {
        if (!hourlyData.time[i]) continue;
        
        const time = new Date(hourlyData.time[i]);
        if (isNaN(time.getTime())) continue;
        
        const hour = time.getHours();
        let displayTime;
        
        if (i === 0 || (hour === currentHour && time.getDate() === now.getDate())) {
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
        
        const isCurrent = i === 0 || (hour === currentHour && time.getDate() === now.getDate());
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