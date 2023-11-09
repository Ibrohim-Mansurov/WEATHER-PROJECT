// https://api.weatherapi.com/v1/forecast.json?key=644f6ce0ca9e401ebb891832211707&q=Tashkent&days=7&aqi=yes&alerts=yes

const $searchForm = document.querySelector("#search-form");
const $searchInput = document.querySelector("#search-input");
const $weatherStateCelsius = document.querySelector(".weather-state-celsius")
const $weather__day__img = document.querySelector("#weather__day-img")
const $weather_city_country = document.querySelector(".weather-city-country")
const $sunset_time = document.querySelector(".sunset-time")
const $sunset_day = document.querySelector(".sunset-day")
const $humidity = document.querySelector(".humidity")
const $uv = document.querySelector(".uv");
const $sunset__time = document.querySelector(".sunset__time");
const $sunrise__time = document.querySelector(".sunrise__time");
const $pa = document.querySelector(".pa");
const $wind_arrow = document.querySelector(".wind-arrow");
const $map = document.querySelector("#map");
const $ctx = document.querySelector("#myChart")
const $themeToggle = document.querySelector("#theme");
const $today = document.querySelector(".today")
const $tomarrow = document.querySelector(".tomorrow")
const $the_next_day = document.querySelector(".the_next_day")
const $img_today = document.querySelector("#today__weather-img")
const $img_tomarrow = document.querySelector("#tomorrow__weather-img")
const $img_nextday = document.querySelector("#nextday__weather-img")
const $today_selsiuc = document.querySelector("#today_celsiuc")
const $tomarrow_selsiuc = document.querySelector("#tomorrow_cesiuc")
const $nextday_sesiuc = document.querySelector("#nextday_celsiuc")

const API_KEY = "644f6ce0ca9e401ebb891832211707"

$searchForm.addEventListener("submit", loadWeatherData);
window.addEventListener("DOMContentLoaded", loadWeatherData);
$themeToggle.addEventListener("change", () => {
    checkTheme($themeToggle.checked)
})

checkTheme(localStorage.getItem("theme") === "dark")

function checkTheme(themeState) {
    if (themeState) {
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
        $themeToggle.checked = true
    }
    else {
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light")
        $themeToggle.checked = false
    }
}


async function loadWeatherData(e) {
    e.preventDefault()
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${$searchInput.value ? $searchInput.value : "Tashkent"}&days=7&aqi=yes&alerts=yes`)
        let data = await response.json()
        renderWeatherData(data)
        console.log(data);
        $searchInput.value = ""
        if (response.status === 403) {
            throw new Error("Somehting went wrong!")
        }
    }
    catch (eror) {
        console.log(eror.message);
    }
}


function renderWeatherData(data) {
    $weatherStateCelsius.innerText = data.current.temp_c + "°C";
    $weather__day__img.src = data.current.condition.icon;
    $weather_city_country.innerText = data.location.country + "," + data.location.name;
    $sunset_time.innerText = data.forecast.forecastday[0].astro.sunset;
    const sunsetDate = data.forecast.forecastday[0].date;
    const sunsetDayOfWeek = getDayOfWeek(sunsetDate);
    $sunset_day.innerText = "Sunset Time," + sunsetDayOfWeek;
    $humidity.innerText = data.current.humidity + "%";
    $uv.innerText = data.current.uv + "out of 10"
    $sunset__time.innerText = data.forecast.forecastday[0].astro.sunset
    $sunrise__time.innerText = data.forecast.forecastday[0].astro.sunrise
    $pa.innerText = data.current.pressure_mb + "PA"
    const windDegree = data.current.wind_degree;
    $wind_arrow.style.transform = `rotate(${windDegree}deg)`;
    $map.src = `https://maps.google.com/maps?q=${$searchInput.value ? $searchInput.value : "Tashkent"}%20Dates%10Products&amp;t=&amp;z=12&amp&output=embed`

    let hours = data.forecast.forecastday[0].hour.map(hour => hour.time.split(" ")[1])
    let temps = data.forecast.forecastday[0].hour.map(hour => hour.temp_c)
    document.querySelector(".chart").innerHTML = '<canvas id="myChart"></canvas>';
    var $ctx = document.getElementById("myChart").getContext("2d");
    new Chart($ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: `Weather data for ${data.location.name}`,
                data: temps,
                borderWidth: 3,
                borderColor: "blueviolet",
                backgroundColor: "#fff"
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 16,
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    var dateStr = data.forecast.forecastday[0].date;
    var date = new Date(dateStr);
    var dayOfWeek = date.getDay();
    var daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var dayOfWeekString = daysOfWeek[dayOfWeek];
    $today.innerText = dayOfWeekString

    var dateStr = data.forecast.forecastday[1].date;
    var date = new Date(dateStr);
    var dayOfWeek = date.getDay();
    var daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var dayOfWeekString = daysOfWeek[dayOfWeek];
    $tomarrow.innerText = dayOfWeekString

    var dateStr = data.forecast.forecastday[2].date;
    var date = new Date(dateStr);
    var dayOfWeek = date.getDay();
    var daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var dayOfWeekString = daysOfWeek[dayOfWeek];
    $the_next_day.innerText = dayOfWeekString
    $img_today.src = data.forecast.forecastday[0].day.condition.icon
    $img_tomarrow.src = data.forecast.forecastday[1].day.condition.icon
    $img_nextday.src = data.forecast.forecastday[1].day.condition.icon
    $today_selsiuc.innerText = data.forecast.forecastday[0].day.avgtemp_c + "°"
    $tomarrow_selsiuc.innerText = data.forecast.forecastday[1].day.avgtemp_c + "°"
    $nextday_sesiuc.innerText = data.forecast.forecastday[2].day.avgtemp_c + "°"
}
function getDayOfWeek(date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    return daysOfWeek[dayOfWeek];
}

