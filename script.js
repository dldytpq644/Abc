document.getElementById("submitBtn").addEventListener("click", function() {
    var city = document.getElementById("city").value;
    if (city.trim() === "") {
        alert("도시를 입력하세요.");
        return;
    }
    fetchWeather(city);
});

async function fetchWeather(city) {
    var apiKey = "2efc837f6c18bc1196c52bb2e9e63b28";
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const rain = data.hasOwnProperty('rain') ? data.rain['1h'] : 0;
        const recommendation = recommendClothing(weatherDescription.toLowerCase(), temperature);
        displayWeather(city, weatherDescription, temperature, humidity, rain, recommendation);
        recommendAndPlayMusic(city); // 노래 추천 및 재생 기능 호출
    } catch (error) {
        console.error('Error:', error);
    }
}

function recommendClothing(weatherDescription, temperature) {
    if (weatherDescription.includes("rain")) {
        return "우산과 방수코트를 준비하세요.";
    } else if (temperature < 5) {
        return "따뜻한 외투와 목도리를 입으세요.";
    } else if (temperature < 15) {
        return "자켓이나 가디건을 입으세요.";
    } else if (temperature < 25) {
        return "얇은 옷을 입으세요.";
    } else {
        return "편안한 옷을 입으세요.";
    }
}

function displayWeather(city, weatherDescription, temperature, humidity, rain, recommendation) {
    var weatherInfo = document.getElementById("weatherInfo");
    weatherInfo.innerHTML = `
        <div class="weather-box">
            <h2>${city}의 현재 날씨</h2>
            <p>날씨: ${weatherDescription}</p>
            <p>온도: ${temperature}°C</p>
            <p>습도: ${humidity}%</p>
            <p>강수량: ${rain}mm</p>
            <p>옷차림 추천: ${recommendation}</p>
        </div>
    `;
}

// 날씨에 따라 노래를 추천하고 재생하는 함수
async function recommendAndPlayMusic(city) {
    try {
        const weather = await getWeather(city);
        const spotifyUrl = await getSpotifyRecommendations(weather);
        displayMusicInfo(weather, spotifyUrl);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayMusicInfo(weather, spotifyUrl) {
    const musicInfo = document.getElementById("musicInfo");
    musicInfo.innerHTML = `
        <div class="music-box">
            <h2>${weather}에 어울리는 음악</h2>
            <p>추천 음악: <a href="${spotifyUrl}" target="_blank">Spotify에서 듣기</a></p>
        </div>
    `;
}

// getWeather 함수, recommendClothing 함수, getSpotifyRecommendations 함수는 위 코드에 추가해야 합니다.
