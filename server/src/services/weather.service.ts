export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

interface GeoSearchResponse {
  results?: Array<{ latitude: number; longitude: number }>;
}

interface ForecastDaily {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface ForecastResponse {
  daily?: ForecastDaily;
}

/**
 * Fetches daily forecast for a place and date range.
 * Returns null if geocoding fails, HTTP fails, or the payload shape is wrong —
 * so callers can still return a successful trip plan without weather.
 */
export async function getWeatherForecast(
  location: string,
  startDate: string,
  endDate: string
): Promise<DailyWeather[] | null> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);

    if (!geoRes.ok) {
      console.warn('[weather] Geocode HTTP', geoRes.status, geoRes.statusText);
      return null;
    }

    const geoData = (await geoRes.json()) as GeoSearchResponse;
    const hit = geoData.results?.[0];
    if (!hit) {
      console.warn('[weather] Location not found:', location);
      return null;
    }

    const { latitude, longitude } = hit;
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto' +
      `&start_date=${startDate}&end_date=${endDate}`;

    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      console.warn('[weather] Forecast HTTP', weatherRes.status, weatherRes.statusText);
      return null;
    }

    const weatherData = (await weatherRes.json()) as ForecastResponse;
    const daily = weatherData.daily;
    if (
      !daily?.time?.length ||
      !daily.weathercode?.length ||
      !daily.temperature_2m_max?.length ||
      !daily.temperature_2m_min?.length
    ) {
      console.warn('[weather] Missing or empty daily forecast fields');
      return null;
    }

    const n = daily.time.length;
    if (
      daily.weathercode.length !== n ||
      daily.temperature_2m_max.length !== n ||
      daily.temperature_2m_min.length !== n
    ) {
      console.warn('[weather] Mismatched daily array lengths');
      return null;
    }

    return daily.time.map((date, index) => ({
      date,
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      weatherCode: daily.weathercode[index],
    }));
  } catch (error) {
    console.error('[weather] getWeatherForecast failed:', error);
    return null;
  }
}
