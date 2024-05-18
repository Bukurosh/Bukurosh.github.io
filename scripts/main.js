const API_KEY = 'wNWp6M3gIAb7D1PA103GpqB23rHN21v7';



const currentTempElement = document
  .getElementById('current-temp');

const minTempE1 = document.getElementById('min-temp');
const maxTempE1 = document.getElementById('max-temp');
const precE1 = document.getElementById('prec');

console.log(currentTempElement);





navigator.geolocation.watchPosition(async (position) => {
  const { latitude: lat, longitude: long } = position.coords;
  console.log(lat);
  console.log(long);
  const weatherData = await getWeather(lat, long);
  console.log(weatherData);

  currentTempElement.innerText =
    `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;
  minTempE1.innerText =
    `${weatherData.daily.temperature_2m_min[0]} ${weatherData.daily_units.temperature_2m_min}`;
  maxTempE1.innerText =
    `${weatherData.daily.temperature_2m_max[0]} ${weatherData.daily_units.temperature_2m_max}`;
  precE1.innerText =
    `${weatherData.current.precipitation} ${weatherData.current_units.precipitation}`;

    const reverseUrl = new URL('/v2/reverse', 'https://api.geocodify.com');
    reverseUrl.searchParams.set('api_key', API_KEY);
    reverseUrl.searchParams.set('lat', lat);
    reverseUrl.searchParams.set('lng', long);
    const response = await fetch(reverseUrl);
    if (response.ok) {
      const geoData = await response.json()
      console.log(geoData);
      geoData.response.features.sort((a, b) => {
        return a.properties.distance - b.properties.distance;
      });
     
      document.getElementById('city').innerText 
      = geoData.response.features[0].properties.county;

    }

});

async function getWeather(lat, long) {
  const url = new URL("/v1/forecast", "https://api.open-meteo.com");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", long);
  url.searchParams.set(
    "current",
    "temperature_2m,precipitation,cloud_cover"
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min"
  );
  url.searchParams.set("forecast_days", "1");
  const request = new Request(url);
  const response = await fetch(request);
  if (response.ok) {
    return response.json();
  } else throw new Error("Network Error");
}