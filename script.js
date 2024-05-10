// OpenWeatherMap API 키
const apiKey = '2efc837f6c18bc1196c52bb2e9e63b28';

// 사용자가 입력한 지역의 날씨 정보를 가져오는 함수
async function searchWeather() {
    const locationInput = document.getElementById('location-input').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류가 발생했습니다.', error);
    }
}

// 가져온 날씨 정보를 표시하는 함수
function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    if (data.cod === 200) {
        weatherInfo.innerHTML = `
            <p>위치: ${data.name}</p>
            <p>온도: ${data.main.temp}°C</p>
            <p>습도: ${data.main.humidity}%</p>
            <p>날씨: ${data.weather[0].main}</p>
        `;
    } else {
        weatherInfo.innerHTML = `<p>날씨 정보를 찾을 수 없습니다.</p>`;
    }
}

