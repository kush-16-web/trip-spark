export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export async function getWeatherForecast(
  location: string,
  startDate: string,
  endDate: string
): Promise<DailyWeather[]>{
    try{
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
        const geoRes = await fetch
        (geoUrl);
        const geoData: any = await geoRes.json();

        if(!geoData.results || geoData.results.length ===0)
        {
            throw new Error(`Location ${location} not found`);
        }

        const {latitude, longitude} = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${startDate}&end_date=${endDate}`;

        const weatherRes = await fetch(weatherUrl);
        const weatherData: any = await weatherRes.json();

        return weatherData.daily.time.map((date:string, index: number) => {
            return {
                date: date,
                tempMax:weatherData.daily.temperature_2m_max[index],
                tempMin:weatherData.daily.temperature_2m_min[index],
                weatherCode:weatherData.daily.weathercode[index],
            };
        });
    }
    catch(error){
        console.error('Error in getWeatherForecast', error);
        throw error;
    }
}