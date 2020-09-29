import React, { useEffect, useState } from "react";
import * as d3 from "d3";

interface countryDataI {
  "Province/State": string | null;
  "Country/Region": string | null;
  Lat: number | null;
  Long: number | null;
  dataByDate: Array<{ date: Date; confirmed: number | null }>;
}

const App = () => {
  const [data, setData] = useState<Array<countryDataI>>([]);
  const getData = async () => {
    const initialCountryData = {
      "Province/State": null,
      "Country/Region": null,
      Lat: null,
      Long: null,
      dataByDate: [],
    };
    const loadedData = await d3.csv("time_series_covid19_confirmed_global.csv");
    const csvData = loadedData.map((d) => {
      const countryData: countryDataI = initialCountryData;
      for (const [key, value] of Object.entries(d)) {
        if (key === "Province/State" || key === "Country/Region") {
          countryData[key] = value ?? null;
        } else if (key === "Lat" || key === "Long") {
          countryData[key] = value ? +value : null;
        } else {
          const date = new Date(key);
          countryData.dataByDate.push({
            date,
            confirmed: value ? +value : null,
          });
        }
      }
      return countryData;
    });
    setData(csvData);
  };
  console.log(data);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const svg = d3.select("svg");
  }, [data]);
  return (
    <div className="App">
      <svg></svg>
    </div>
  );
};

export default App;
