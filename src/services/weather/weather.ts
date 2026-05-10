export interface WeatherDay {
  date: string;
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherApiResponse {
  forecast: {
    forecastday: ForecastDay[];
  };
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchTripWeather = async (
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<WeatherDay[]> => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tripStart = new Date(startDate);

    if (tripStart < today) {
        return [];
    }
  const days =
    Math.ceil(
      (new Date(endDate).getTime() -
        new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${days}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch weather");
  }

  const data: WeatherApiResponse = await res.json();

  return data.forecast.forecastday.map((day) => ({
    date: day.date,
    temp: day.day.avgtemp_c,
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
  }));
};