<?php
session_start();
echo $_SESSION['username'];
session_unset();
if(!isset($_SESSION['username'])){
  header("Location:../htmls/authentication.html?message=loginExpired");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pixel Weather Changed</title>
    <link rel="stylesheet" href="./style.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Search Page -->
    <div id="search-page" class="search-page">
      <!-- hamburger-menu -->
      <div class="circle">
        <div class="closeCircle"><img src="../assests/user.png" alt="" /></div>

        <div  class="sectionContainer hidden">
          <div id="user-profile" class="section hidden">
            <img src="../assests/user.png" alt="" class="burger-icon" />Profile
          </div>
          <div class="section hidden" id="add-favorites">
            <img class="burger-icon" src="../assests/love.png" alt="" />Add
            favorites
          </div>
          <div id="edit-favorites" class="section hidden">
            <img src="../assests/edit.png" alt="" class="burger-icon" />Edit
            favorites
          </div>
          <div id="delete-favorites" class="section hidden">
            <img class="burger-icon" src="../assests/delete.png" alt="" />Delete
            favorites
          </div>
          <div class="section hidden">
            <img src="../assests/logout.png" alt="" class="burger-icon" />Log out
          </div>
        </div>
      </div>
      <!-- favorites section  -->
      <div id="favorite-widget1" class="favorite-widget hidden">
        <div class="placename">------</div>
        <!-- <div class="widget-img"><img src="https://openweathermap.org/img/wn/04d@2x.png" alt="weatherIcon"></div> -->
        <div class="widget-temperature">--</div>
        <!-- <div class="widget-description">Overcast</div> -->

        <!-- <div class="widget-minmax"><div class="max">High --</div><div class="min">Low --</div></div> -->
      </div>

      <!-- search section  -->
      <div class="search-card">
        <h2>Weather</h2>
        <div class="search-container">
          <input
            type="text"
            id="city"
            placeholder="Search for a city"
            onkeypress="if(event.key==='Enter') getWeather()"
          />
          <button class="search-button" onclick="getWeather()">Search</button>
        </div>
      </div>
      <div
        id="favorite-widget2"
        class="favorite-widget favorite-widget2 hidden"
      >
        <div class="placename">------</div>
        <!-- <div class="widget-img"><img src="https://openweathermap.org/img/wn/04d@2x.png" alt="weatherIcon"></div> -->
        <div class="widget-temperature">--</div>
        <!-- <div class="widget-description">Overcast</div> -->

        <!-- <div class="widget-minmax"><div class="max">High --</div><div class="min">Low --</div></div> -->
      </div>
    </div>

    <!-- Results Page -->
    <div id="results-page" class="results-page hidden">
      <div class="weather-header">
        <button class="back-button" onclick="goBack()">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div id="city-name" class="header-city-name"></div>
        <div class="header-search-icon" onclick="toggleSearch()">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      <div class="header-search-bar hidden" id="header-search-bar">
        <input
          type="text"
          id="city-header"
          placeholder="Search for a city"
          onkeypress="if(event.key==='Enter') getWeather()"
        />
        <button onclick="getWeather()">Search</button>
      </div>

      <div class="weather-main">
        <div class="current-weather-section">
          <div id="loading-state" class="hidden">
            <img class="loading" src="../assests/loading.png" alt=".." />
            Loading...
          </div>
          <div id="hiddenWhenLoad">
            <div id="weather-condition" class="weather-condition"></div>
            <div class="temp-section">
              <div id="temp-div"></div>
              <img alt="imgage" id="weather-icon" />
            </div>
            <div id="feels-like-text" class="feels-like-text"></div>
            <div id="high-low-temp" class="high-low-temp"></div>
          </div>
        </div>

        <div id="hourly-forecast" class="hourly-section"></div>

        <div id="daily-forecast" class="daily-section"></div>

        <div class="details-grid">
          <div class="detail-card wind-card">
            <div class="detail-icon">💨</div>
            <div class="detail-label">Wind</div>
            <div id="wind-speed" class="detail-value">--</div>
            <div id="wind-direction" class="detail-subvalue">--</div>
          </div>
          <div class="detail-card sunrise-card">
            <div class="detail-icon">☀️</div>
            <div class="detail-label">Sunrise & Sunset</div>
            <div class="sunrise-sunset-visual" id="sunrise-sunset-visual"></div>
            <div class="sunrise-sunset-times">
              <span id="sunrise-time">--</span>
              <span id="sunset-time">--</span>
            </div>
          </div>
          <div class="detail-card uv-card">
            <div class="detail-icon">☀️</div>
            <div class="detail-label">UV Index</div>
            <div id="uv-index" class="detail-value">--</div>
            <div id="uv-label" class="detail-subvalue">--</div>
          </div>
          <div class="detail-card aqi-card">
            <div class="detail-icon">🌫️</div>
            <div class="detail-label">AQI</div>
            <div id="aqi" class="detail-value">--</div>
            <div class="aqi-bar">
              <div class="aqi-bar-fill" id="aqi-bar-fill"></div>
            </div>
            <div id="aqi-label" class="detail-subvalue">--</div>
          </div>
          <div class="detail-card visibility-card">
            <div class="detail-icon">👁️</div>
            <div class="detail-label">Visibility</div>
            <div id="visibility" class="detail-value">--</div>
          </div>
          <div class="detail-card humidity-card">
            <div class="detail-icon">💧</div>
            <div class="detail-label">Humidity</div>
            <div id="humidity" class="detail-value">--</div>
            <div id="dew-point" class="detail-subvalue">--</div>
          </div>
          <div class="detail-card pressure-card">
            <div class="detail-icon">📊</div>
            <div class="detail-label">Pressure</div>
            <div id="pressure" class="detail-value">--</div>
            <div class="detail-subvalue">mbar</div>
          </div>
        </div>
      </div>
    </div>
    <!-- add favorites -->
    <div id="add-favorites-page" class="hidden">
      <button id="favorite-back" class="back-button" onclick="goBack()">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          7
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h2 class="heading">Add-Favorites</h2>
      <div id="favorite-input-container">
        <input
          id="favorite-input"
          placeholder="Enter a city name"
          type="text"
          name=""
        />
        <button id="favorite-search-button" class="search-button">Add</button>
      </div>
      <div id="add-fav-loading" class="hidden">
        <img class="loading" src="../assests/loading.png" alt=".." />
        please wait...
      </div>
    </div>
    <!-- editPage -->
    <div id="edit-page" class="hidden">
      <div class="identity">
        <button class="back-button" onclick="goBack()">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            7
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        Edit-favorites
      </div>
      <div class="no-favorites">
        <h2>You have no Favorites</h2>
        <div class="suggestion">You can add it through "Add favorites"</div>
      </div>
      <div class="parent-container hidden">
        <div class="your-favorites">Your favorites:</div>
        <div class="container hidden">
          <div class="favorite-city">Los Angeles Dal</div>
          <div id="loading-state1" class="hidden">
            <img class="loading" src="../assests/loading.png" alt=".." />
          </div>
          <button class="edit-btn">Edit</button>
        </div>
        <div class="container hidden">
          <div class="favorite-city">Kathmandu</div>
          <div id="loading-state2" class="hidden">
            <img class="loading" src="../assests/loading.png" alt=".." />
          </div>
          <button class="edit-btn">Edit</button>
        </div>
      </div>
    </div>

    <!-- delte favorites page -->
    <div id="delete-favorites-page" class="hidden">
      <button class="back-button" onclick="goBack()">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          7
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="no-favorites">
        <h2>You have no Favorites</h2>
        <div class="suggestion">You can add it through "Add favorites"</div>
      </div>
      <div id="parent-delete-container" class="hidden">
        <div class="your-favorites">Your favorites:</div>
        <div class="delete-container hidden">
          <div class="favorite-city">Los Angeles Dal</div>
          <div id="delete-loading-state1" class="hidden">
            <img class="loading" src="../assests/loading.png" alt=".." />
          </div>
          <button class="delete-btn">Delete</button>
        </div>
        <div class="delete-container hidden">
          <div class="favorite-city">Kathmandu</div>
          <div id="del-loading-state2" class="hidden">
            <img class="loading" src="../assests/loading.png" alt=".." />
          </div>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
    <!-- delete alert -->
    <div id="delete-alert-page" class="hidden">
      <div class="delete-overlay"></div>
      <div class="delete-alert-container">
        <div class="child-alert-container">
          <div class="delete-alert">
            <img src="../assests/warning.png" alt="warning" class="alert-img" />
            <div class="alert-heading">Delete Favorites</div>
            <div class="alert-message">
              Are you sure you want to delete this?
            </div>
            <div class="alert-message">This can't be undone</div>
            <div class="buttons">
              <button id="cancel">Cancel</button>
              <button id="delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- user profile -->
    <div id="user-profile-page" class="hidden">
      <button class="back-button" onclick="goBack()">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="user-profile-parent">
        <div class="user-profile-container">
          <div class="avatar">
            <img
              src="../assests/ChatGPT Image Dec 12, 2025, 06_32_43 PM.png"
              alt="avatar"
            />
          </div>
          <div class="main-headings">
            <div class="name">Anonymous User</div>
            <div class="header-username">@nisal444</div>
          </div>
          <div class="user-details">
            <div class="details">
              <div class="headings">Username:</div>
              <div class="username">nisal444</div>
            </div>
            <div class="details">
              <div class="headings">Email:</div>
              <div class="email">nisal@gmail.com</div>
            </div>
            <div class="details">
              <div class="headings">Account Created:</div>
              <div class="created-at">2023-01-11</div>
            </div>
            <div class="details">
              <div class="headings">Status:</div>
              <div class="status">User</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script src="./script.js"></script>
  </body>
</html>
