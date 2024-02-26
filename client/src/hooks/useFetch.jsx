import { useEffect, useState } from "react";

const useFetch = (apiFunction) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFunction();
        const responseData = response.data.data;
        setData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [apiFunction]);

  return { data, setData };
};

export default useFetch;
