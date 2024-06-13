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
        recommendAndPlayMusic(weatherDescription); // 노래 추천 및 재생 기능 호출
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

// YouTube Data API를 사용하여 노래를 추천하는 함수
async function recommendAndPlayMusic(weatherDescription) {
    try {
        const query = getMusicQuery(weatherDescription);
        const videoData = await getYouTubeRecommendations(query);
        displayMusicInfo(weatherDescription, videoData);
    } catch (error) {
        console.error('Error:', error);
    }
}

function getMusicQuery(weatherDescription) {
    if (weatherDescription.includes("rain")) {
        return "Korean rainy day music";
    } else if (weatherDescription.includes("clear")) {
        return "Korean sunny day music";
    } else if (weatherDescription.includes("clouds")) {
        return "Korean cloudy day music";
    } else {
        return "Korean weather music";
    }
}

async function getYouTubeRecommendations(query) {
    const apiKey = "AIzaSyAXSnLoToBeyyQI5d9SvYdkOAEL14UReZU"; // 유튜브 데이터 API 키를 여기에 입력하세요
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items.length > 0) {
            const video = data.items[0]; // 첫 번째 검색 결과를 사용
            const videoData = {
                videoId: video.id.videoId,
                title: video.snippet.title,
                thumbnailUrl: video.snippet.thumbnails.default.url
            };
            return videoData;
        } else {
            throw new Error("No videos found");
        }
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
}

function displayMusicInfo(weather, videoData) {
    const musicInfo = document.getElementById("musicInfo");
    musicInfo.innerHTML = `
        <div class="music-box">
            <h2>${weather}에 어울리는 음악</h2>
            <p>추천 음악: <a href="https://www.youtube.com/watch?v=${videoData.videoId}" target="_blank">${videoData.title}</a></p>
            <img src="${videoData.thumbnailUrl}" alt="Thumbnail">
        </div>
    `;
}
