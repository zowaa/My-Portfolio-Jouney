import axios from "axios";
import { useEffect, useState } from "react";

const Weather = () => {
  const [dataLocation, setDataLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const ipdataAPI_key = import.meta.env.VITE_IPDATA_API;

  useEffect(() => {
    const fetchWeather = async () => {
      setIsError(false);
      setIsLoading(true);

      //fetch location
      try {
        const url = `https://api.ipdata.co?api-key=${ipdataAPI_key}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;
          if (!data || Object.keys(data).length === 0) {
            setIsError(true);
            console.log(
              `Error in location fetch: Data object Empty, no data returned`,
            );
          } else setDataLocation(data);
        } else if (response.status === 403) {
          setIsError(true);
          console.log(`Error in location fetch: Quota excessed`);
        } else {
          setIsError(true);
          console.log(
            `Error in location fetch: Received status code ${response.status}`,
          );
        }
      } catch (err: unknown) {
        setIsError(true);
        if (axios.isAxiosError(err)) {
          // If the error is an Axios error
          if (err.response) {
            // Request made, but server responded with a status code outside of 2xx
            console.log(
              `Error in location fetch: status: ${err.response.status}, data: ${err.response.data}`,
            );
          } else if (err.request) {
            // Request made, but no response received
            console.log(
              `Error in location fetch: No response received from the server, ${err.request}`,
            );
          }
        } else if (err instanceof Error) {
          // A generic Error
          console.log(
            `Error in location fetch: Problem with the request, ${err.message}`,
          );
        } else {
          // Handle any unexpected errors
          console.log(`Error in location fetch: Unexpected error`, err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>error</p>
      ) : (
        <p>
          {dataLocation.city}
          {console.log(dataLocation)}
        </p>
      )}
    </>
  );
};

export default Weather;
