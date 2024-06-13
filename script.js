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
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const rain = data.hasOwnProperty('rain') ? data.rain['1h'] : 0;
        const recommendation = recommendClothing(weatherDescription.toLowerCase(), temperature);
        displayWeather(city, weatherDescription, temperature, humidity, rain, recommendation);
        recommendAndPlayMusic(weatherDescription); // 음악 추천 함수 호출
        fetchHoroscope(city); // 운세 함수 호출
    } catch (error) {
        console.error('에러:', error);
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
        return "비 오는 날 듣기 좋은 노래";
    } else if (weatherDescription.includes("clear")) {
        return "맑은 날 듣기 좋은 노래";
    } else if (weatherDescription.includes("clouds")) {
        return "흐린 날 듣기 좋은 노래";
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

async function fetchHoroscope(city) {
    // 해당 도시의 운세 데이터를 가져오는 로직을 구현합니다.
    // 예시:
    const horoscope = await getHoroscope(city);
    displayHoroscope(city, horoscope);
}

async function getHoroscope(city) {
    // 해당 도시에 맞는 운세 데이터를 가져오는 API 호출을 구현합니다.
    // 예시:
    const horoscopeData = await fetchHoroscopeData(city); // 이 함수는 필요에 따라 구현해야 합니다.
    return horoscopeData;
}

function displayHoroscope(city, horoscope) {
    const horoscopeInfo = document.getElementById("horoscopeInfo");
    horoscopeInfo.innerHTML = `
        <div class="horoscope-box">
            <h2>${city}의 오늘 운세</h2>
            <p>${horoscope}</p>
        </div>
    `;
}

// 각 날씨 상태에 따른 운세 데이터를 배열로 정의합니다.
const weatherHoroscopes = {
    "rain": [
        "오늘은 자신의 직감을 믿고 결정을 내리는 것이 중요한 하루입니다.",
        "너무 과거에 길들여진 생각을 버리고 새로운 가능성을 열어보세요.",
        "오늘은 타인과의 협력이 중요한 날입니다. 상호 작용을 통해 큰 성과를 이룰 수 있습니다.",
        "내면의 평화를 찾는 시간이 필요한 날입니다. 조용한 곳에서 명상하고 균형을 찾으세요.",
        "오늘은 새로운 시작을 위한 완벽한 날입니다. 당신의 열정과 목표를 추구하세요.",
        "사랑과 관계에 긍정적인 변화가 찾아올 수 있는 날입니다. 열린 마음으로 대화를 나누세요.",
        "내일의 계획을 세우는 것이 오늘의 중요한 과제입니다. 미래를 위한 준비를 시작하세요.",
        "현재의 어려움은 곧 해결될 것입니다. 인내심을 가지고 문제에 접근하세요.",
        "자신의 감정을 솔직하게 표현하는 것이 중요한 날입니다. 소통을 통해 해결책을 찾으세요.",
        "오늘은 뜻밖의 기회가 찾아올 수 있는 날입니다. 기회를 잡고 새로운 시작을 해보세요."
    ],
    "clear": [
        "오늘은 자신의 직감을 믿고 결정을 내리는 것이 중요한 하루입니다.",
        "너무 과거에 길들여진 생각을 버리고 새로운 가능성을 열어보세요.",
        "오늘은 타인과의 협력이 중요한 날입니다. 상호 작용을 통해 큰 성과를 이룰 수 있습니다.",
        "내면의 평화를 찾는 시간이 필요한 날입니다. 조용한 곳에서 명상하고 균형을 찾으세요.",
        "오늘은 새로운 시작을 위한 완벽한 날입니다. 당신의 열정과 목표를 추구하세요.",
        "사랑과 관계에 긍정적인 변화가 찾아올 수 있는 날입니다. 열린 마음으로 대화를 나누세요.",
        "내일의 계획을 세우는 것이 오늘의 중요한 과제입니다. 미래를 위한 준비를 시작하세요.",
        "현재의 어려움은 곧 해결될 것입니다. 인내심을 가지고 문제에 접근하세요.",
        "자신의 감정을 솔직하게 표현하는 것이 중요한 날입니다. 소통을 통해 해결책을 찾으세요.",
        "오늘은 뜻밖의 기회가 찾아올 수 있는 날입니다. 기회를 잡고 새로운 시작을 해보세요."
    ],
    "clouds": [
        "오늘은 자신의 직감을 믿고 결정을 내리는 것이 중요한 하루입니다.",
        "너무 과거에 길들여진 생각을 버리고 새로운 가능성을 열어보세요.",
        "오늘은 타인과의 협력이 중요한 날입니다. 상호 작용을 통해 큰 성과를 이룰 수 있습니다.",
        "내면의 평화를 찾는 시간이 필요한 날입니다. 조용한 곳에서 명상하고 균형을 찾으세요.",
        "오늘은 새로운 시작을 위한 완벽한 날입니다. 당신의 열정과 목표를 추구하세요.",
        "사랑과 관계에 긍정적인 변화가 찾아올 수 있는 날입니다. 열린 마음으로 대화를 나누세요.",
        "내일의 계획을 세우는 것이 오늘의 중요한 과제입니다. 미래를 위한 준비를 시작하세요.",
        "현재의 어려움은 곧 해결될 것입니다. 인내심을 가지고 문제에 접근하세요.",
        "자신의 감정을 솔직하게 표현하는 것이 중요한 날입니다. 소통을 통해 해결책을 찾으세요.",
        "오늘은 뜻밖의 기회가 찾아올 수 있는 날입니다. 기회를 잡고 새로운 시작을 해보세요."
    ],
    "other": [
        "오늘은 자신의 직감을 믿고 결정을 내리는 것이 중요한 하루입니다.",
        "너무 과거에 길들여진 생각을 버리고 새로운 가능성을 열어보세요.",
        "오늘은 타인과의 협력이 중요한 날입니다. 상호 작용을 통해 큰 성과를 이룰 수 있습니다.",
        "내면의 평화를 찾는 시간이 필요한 날입니다. 조용한 곳에서 명상하고 균형을 찾으세요.",
        "오늘은 새로운 시작을 위한 완벽한 날입니다. 당신의 열정과 목표를 추구하세요.",
        "사랑과 관계에 긍정적인 변화가 찾아올 수 있는 날입니다. 열린 마음으로 대화를 나누세요.",
        "내일의 계획을 세우는 것이 오늘의 중요한 과제입니다. 미래를 위한 준비를 시작하세요.",
        "현재의 어려움은 곧 해결될 것입니다. 인내심을 가지고 문제에 접근하세요.",
        "자신의 감정을 솔직하게 표현하는 것이 중요한 날입니다. 소통을 통해 해결책을 찾으세요.",
        "오늘은 뜻밖의 기회가 찾아올 수 있는 날입니다. 기회를 잡고 새로운 시작을 해보세요."
    ]
};

async function fetchHoroscope(weatherDescription) {
    const horoscope = getHoroscope(weatherDescription);
    displayHoroscope(weatherDescription, horoscope);
}

function getHoroscope(weatherDescription) {
    // 주어진 날씨 상태에 맞는 운세를 랜덤하게 선택합니다.
    if (weatherDescription.includes("rain")) {
        return randomChoice(weatherHoroscopes["rain"]);
    } else if (weatherDescription.includes("clear")) {
        return randomChoice(weatherHoroscopes["clear"]);
    } else if (weatherDescription.includes("clouds")) {
        return randomChoice(weatherHoroscopes["clouds"]);
    } else {
        return randomChoice(weatherHoroscopes["other"]);
    }
}

function randomChoice(array) {
    // 배열에서 랜덤하게 하나의 요소를 선택합니다.
    return array[Math.floor(Math.random() * array.length)];
}

function displayHoroscope(weatherDescription, horoscope) {
    const horoscopeInfo = document.getElementById("horoscopeInfo");
    horoscopeInfo.innerHTML = `
        <div class="horoscope-box">
            <h2>오늘의 운세</h2>
            <p>${horoscope}</p>
        </div>
    `;
}


