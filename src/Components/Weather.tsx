import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//keys to remove after fetching in the backend
const ipdataAPI_key = import.meta.env.VITE_IPDATA_API;
const weatherAPI_key = import.meta.env.VITE_WEATHERAPI_API;
const opencageAPI_key = import.meta.env.VITE_OPENCAGE_API;

interface WeatherInfo {
  location: { name: string }; // to delete and use city instead
  current: { temp_c: number; condition: { text: string; icon: string } };
}

const Weather = () => {
  const { t, i18n } = useTranslation();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [city, setCity] = useState<string>("");

  const fetchData = async ({
    url,
    code,
    name,
  }: {
    url: string;
    code: number;
    name: string;
  }) => {
    try {
      const response = await axios.get(url);
      if (response.status === 200) return response.data;
      else if (response.status === code) {
        setIsError(true);
        console.log(`Error in ${name} fetch: Quota excessed`);
      } else {
        setIsError(true);
        console.log(
          `Error in ${name} fetch: Received status code ${response.status}`,
        );
      }
    } catch (err) {
      setIsError(true);
      console.log(`Error in ${name} fetch: ${err}`);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        //fetch location with ipdata API
        const locationData = await fetchData({
          url: `https://api.ipdata.co?api-key=${ipdataAPI_key}`,
          code: 403,
          name: "location",
        });

        if (!locationData?.latitude || !locationData?.longitude) {
          setIsError(true);
          return;
        }

        const { latitude, longitude } = locationData;

        //fetch city name with opencage API
        const cityData = await fetchData({
          url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${opencageAPI_key}&language=${i18n.language}`,
          code: 429,
          name: "city",
        });

        if (!cityData?.results[0]?.components?.city) {
          setIsError(true);
          return;
        }

        setCity(cityData.results[0].components.city);

        //fetch weather with weatherapi API
        const weatherData = await fetchData({
          url: `https://api.weatherapi.com/v1/current.json?key=${weatherAPI_key}&q=${latitude},${longitude}&lang=${i18n.language}`,
          code: 403,
          name: "weather",
        });

        if (
          !weatherData?.current?.condition?.text ||
          !weatherData?.current?.condition?.icon
        ) {
          setIsError(true);
          return;
        }

        setWeatherInfo(weatherData);
      } catch (err) {
        setIsError(true);
        console.log(`Error in fetchWeather: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [i18n.language]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>error</p>
      ) : (
        weatherInfo && (
          <>
            <p>
              {t("city1")}
              {weatherInfo.location.name}
            </p>
            <p>
              {t("city2")}
              {city}
            </p>
            <p>{weatherInfo.current.temp_c}</p>
            <p>{weatherInfo.current.condition.text}</p>
            <img src={weatherInfo.current.condition.icon} alt="icon" />
          </>
        )
      )}
    </>
  );
};

export default Weather;
