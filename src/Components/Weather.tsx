import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface WeatherInfo {
  location: { name: string };
  current: { temp_c: number; condition: { text: string; icon: string } };
}

const Weather = () => {
  const { i18n } = useTranslation();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const ipdataAPI_key = import.meta.env.VITE_IPDATA_API;
  const weatherAPI_key = import.meta.env.VITE_WEATHERAPI_API;

  useEffect(() => {
    const fetchWeather = async () => {
      let locationData: { latitude?: number; longitude?: number } = {};

      setIsError(false);
      setIsLoading(true);

      //fetch location with ipdata API
      try {
        const url = `https://api.ipdata.co?api-key=${ipdataAPI_key}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;
          if (!data || !data.latitude || !data.longitude) {
            setIsError(true);
            console.log(
              `Error in location fetch: Data object Empty, no data returned`,
            );
          } else {
            locationData = data;
          }
        } else if (response.status === 403) {
          setIsError(true);
          console.log(`Error in location fetch: Quota excessed`);
        } else {
          setIsError(true);
          console.log(
            `Error in location fetch: Received status code ${response.status}`,
          );
        }
      } catch (err) {
        setIsError(true);
        console.log(`Error in location fetch: ${err}`);
      }

      if (isError) {
        setIsLoading(false);
        return;
      }

      //fetch weather with weatherapi API
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${weatherAPI_key}&q=${locationData.latitude},${locationData.longitude}&lang=${i18n.language}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;
          if (!data) {
            setIsError(true);
            console.log(
              `Error in weather fetch: Data object Empty, no data returned`,
            );
          } else {
            setWeatherInfo(data);
          }
        } else if (response.status === 403) {
          setIsError(true);
          console.log(`Error in weather fetch: Quota excessed`);
        } else {
          setIsError(true);
          console.log(
            `Error in weather fetch: Received status code ${response.status}`,
          );
        }
      } catch (err) {
        setIsError(true);
        console.log(`Error in weather fetch: ${err}`);
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
            <p>{weatherInfo.location.name}</p>
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
