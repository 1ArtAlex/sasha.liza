key = "9d57bfbec08146ddc192054d0187cf9a";

let result = document.getElementById("result");

const iconMapping = {
    "Clear": { icon: "weather/clear.svg", text: "Ясно" },
    "Clouds": { icon: "weather/clouds.svg", text: "Облачно" },
    "Mist": { icon: "weather/mist.svg", text: "Туман" },
    "Fog": { icon: "weather/mist.svg", text: "Туман" },
    "Haze": { icon: "weather/mist.svg", text: "Дымка" },
    "Rain": { icon: "weather/rain.svg", text: "Дождь" },
    "Drizzle": { icon: "weather/moderate_heavy_rain.svg", text: "Морось" },
    "Thunderstorm": { icon: "weather/thunder.svg", text: "Гроза" },
    "Thunderstorm with Rain": { icon: "weather/thunder_rain.svg", text: "Гроза с дождем" },
    "Snow": { icon: "weather/snow.svg", text: "Снег" }
};

let getWeather = (city = "Simferopol") => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=ru`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric&lang=ru`;

    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let weatherType = data.weather[0].main;
            let description = data.weather[0].description;
            let iconData = iconMapping[weatherType] || { icon: "no-result.svg", text: "Неизвестно" };

            result.innerHTML = `
                <h2>${data.name}</h2>
                <h4 class="weather">${iconData.text}</h4>
                <h4 class="desc">${description}</h4>
                <img id="current-weather-icon" src="${iconData.icon}" alt="${weatherType}">
                <h1>${data.main.temp} &#176;</h1>
                <div id="forecast" class="temp-container"></div>
            `;

            return fetch(forecastUrl);
        })
        .then((resp) => resp.json())
        .then((forecastData) => {
            let forecastHTML = ``;

            for (let i = 0; i < 3; i++) {
                let forecast = forecastData.list[i];
                let time = new Date(forecast.dt * 1000).getHours();
                let weatherType = forecast.weather[0].main;
                let iconData = iconMapping[weatherType] || { icon: "no-result.svg", text: "Неизвестно" };

                forecastHTML += `
                    <div class="forecast-item">
                        <h4>${time}:00</h4>
                        <img src="${iconData.icon}" alt="${weatherType}">
                        <h4 class="temp">${forecast.main.temp}&#176;</h4>
                    </div>
                `;
            }

            document.getElementById("forecast").innerHTML = forecastHTML;
        })
        .catch(() => {
            result.innerHTML = `<h3 class="msg">Город не найден</h3>`;
        });
};

window.addEventListener("load", () => getWeather());
