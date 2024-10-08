import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface WeatherInfo {
  location: { name: string };
  current: { temp_c: number; condition: { text: string; icon: string } };
}

const Weather = () => {
  const { t, i18n } = useTranslation();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [city, setCity] = useState<string>("");

  const ipdataAPI_key = import.meta.env.VITE_IPDATA_API;
  const weatherAPI_key = import.meta.env.VITE_WEATHERAPI_API;
  const opencageAPI_key = import.meta.env.VITE_OPENCAGE_API;

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

      //fetch city name with opencage API
      try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${locationData.latitude},${locationData.longitude}&key=${opencageAPI_key}&language=${i18n.language}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;
          if (
            !data ||
            !data.results ||
            !data.results[0] ||
            !data.results[0].components ||
            !data.results[0].components.city
          ) {
            setIsError(true);
            console.log(
              `Error in city fetch: Data object Empty, no data returned`,
            );
          } else {
            setCity(data.results[0].components.city);
          }
        } else if (response.status === 429) {
          setIsError(true);
          console.log(`Error in city fetch: Quota excessed`);
        } else {
          setIsError(true);
          console.log(
            `Error in city fetch: Received status code ${response.status}`,
          );
        }
      } catch (err) {
        setIsError(true);
        console.log(`Error in city fetch: ${err}`);
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
          if (
            !data ||
            !data.location ||
            !data.current ||
            !data.current.temp_c ||
            !data.current.condition ||
            !data.current.condition.text ||
            !data.current.condition.icon ||
            !data.location.name
          ) {
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
