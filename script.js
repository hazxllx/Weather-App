// Function to fetch weather data from a given URL
function fetchWeatherData(url) {
    return fetch(url) // request
        .then(response => {
            console.log('Fetching data from:', url); 
            if (!response.ok) { // Check if the response status 
                throw new Error('Error fetching data'); // Throw an error for handling later
            }
            return response.json(); // Parse and return the response as JSON
        })
        .then(data => {
            console.log('Received data:', data); 
            return data; // Return the parsed data
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error; // Re-throw the error for handling in the caller function
        });
}

// Function to get weather information for the entered city
function getWeather() {
    const apiKey = '895f04ba012449906f4cdf12b4909be8'; // OpenWeather API key
    const city = document.getElementById('city').value.trim(); // Get city name from the input field

    if (!city) { // Check if the city field is empty
        alert('Please enter a city');
        return;
    }

    // Build URLs for current weather and forecast data
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data and display it
    fetchWeatherData(currentWeatherUrl)
        .then(data => displayWeather(data)) // Call displayWeather to update the UI
        .catch(error => console.log('Error fetching current weather:', error)); // Handle errors

    // Fetch forecast data and display it
    fetchWeatherData(forecastUrl)
        .then(data => displayHourlyForecast(data.list)) // Call displayHourlyForecast to show hourly forecast
        .catch(error => console.log('Error fetching forecast:', error)); // Handle errors
}

// Function to display current weather information
function displayWeather(data) {
    console.log('Displaying weather:', data); 

    // Get elements to update the UI
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const body = document.body;
    const container = document.querySelector('#weather-container');

    tempDivInfo.innerHTML = ''; // Clear previous temperature data
    weatherInfoDiv.innerHTML = ''; // Clear previous weather info

    // Check if the response was successful
    if (data.cod !== 200) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Show an error message from the response
        return;
    }

    // Extract relevant data from the response
    const { name, main, weather } = data;
    const temperature = Math.round(main.temp); // Round the temperature
    const description = weather[0].description; // Get the weather description
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`; // Build the icon URL

    // Update the design with weather details
    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${name}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl; // Set the weather icon
    weatherIcon.style.display = 'block'; // visibility 

    // Set default background color
    let bgColor = "#D3D3D3"; 

    // Change background color based on the weather description
    if (description.includes("clear")) {
        bgColor = "#87CEEB"; // Light blue 
    } else if (description.includes("cloud")) {
        bgColor = "#B0C4DE"; // Grayish blue 
    } else if (description.includes("rain")) {
        bgColor = "#4682B4"; // Dark blue 
    } else if (description.includes("snow")) {
        bgColor = "#FFFFFF"; // White 
    } else if (description.includes("thunderstorm")) {
        bgColor = "#2F4F4F"; // Dark gray 
    }

    body.style.backgroundColor = bgColor; // Apply the background color to the body
    container.style.backgroundColor = "#2C3E50"; // Set container background to dark navy blue
    container.style.color = "#FFFFFF"; // Set the text color to white for readability
}

// Function to display the hourly weather forecast
function displayHourlyForecast(hourlyData) {
    console.log('Displaying hourly forecast:', hourlyData);

    const hourlyForecastDiv = document.getElementById('hourly-forecast'); // Get the hourly forecast container
    const template = document.getElementById('hourly-item-template'); // Get the hidden template

    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast data

    // Show forecast for the next 8 hours
    hourlyData.slice(0, 8).forEach(item => {
        const hour = new Date(item.dt * 1000).getHours(); // Convert timestamp to hour
        const temperature = Math.round(item.main.temp); // Round the temperature
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`; // Build the icon URL

        // Clone the hidden template and update its content
        const hourlyItem = template.cloneNode(true);
        hourlyItem.style.display = 'block'; // Make the item visible
        hourlyItem.querySelector('.hour').textContent = `${hour}:00`; // the hour
        hourlyItem.querySelector('.icon').src = iconUrl; // the weather icon
        hourlyItem.querySelector('.temperature').textContent = `${temperature}°C`; // Set the temperature

        // Add the updated item to the forecast container
        hourlyForecastDiv.appendChild(hourlyItem);
    });
}
