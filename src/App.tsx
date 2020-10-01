import React, { useEffect, useState } from "react";
import { Reset } from "styled-reset";
import * as d3 from "d3";
import LineChart from "./Components/LineChart";
import MapWithCircles from "./Components/MapWithCircles";

export interface IDateCount {
  date: number;
  count: number;
}

interface I {
  Cases: number;
  City: string;
  CityCode: string;
  Country: string;
  CountryCode: string;
  Date: string;
  Lat: string;
  Lon: string;
  Province: string;
  Status: string;
}

const getApiData = async () => {
  const response = await fetch(
    "https://api.covid19api.com/country/south-africa/status/confirmed"
  );
  const loadedData = await response.json();
  const data: Array<IDateCount> = loadedData.map((d: I) => ({
    date: new Date(d.Date).getTime(),
    count: d.Cases,
  }));
  return data;
};

const getCsvData = async (fileName: string) => {
  const loadedData = await d3.csv(fileName);
  const selectedData = loadedData.filter(
    (d) => d["Country/Region"] === "Japan"
  );
  const filteredData = Object.entries(selectedData[0]).filter(([key, _]) => {
    const date = new Date(key);
    if (isNaN(date.getTime())) {
      return false;
    } else {
      return true;
    }
  });
  const data = filteredData.map((d) => {
    const date = new Date(d[0]);
    return {
      date: date.getTime(),
      count: d[1] ? +d[1] : 0,
    };
  });
  return data;
};

const App = () => {
  const [cumulativeCasesData, setCumulativeCasesData] = useState<Array<
    IDateCount
  > | null>(null);
  const [cumulativeDeathsData, setCumulativeDeathsData] = useState<Array<
    IDateCount
  > | null>(null);
  const [cumulativeRecoveredData, setCumulativeRecoveredData] = useState<Array<
    IDateCount
  > | null>(null);
  const [testData, setTestData] = useState<Array<IDateCount> | null>(null);
  useEffect(() => {
    // getCsvData("time_series_covid19_confirmed_global.csv").then((data) =>
    //   setCumulativeCasesData(data)
    // );
    // getCsvData("time_series_covid19_deaths_global.csv").then((data) =>
    //   setCumulativeDeathsData(data)
    // );
    // getCsvData("time_series_covid19_recovered_global.csv").then((data) =>
    //   setCumulativeRecoveredData(data)
    // );
    // getApiData().then((data) => setTestData(data));
  }, []);
  return (
    <div className="App">
      <Reset />
      {/* {cumulativeCasesData && <LineChart data={cumulativeCasesData} />}
      {cumulativeDeathsData && <LineChart data={cumulativeDeathsData} />}
      {cumulativeRecoveredData && <LineChart data={cumulativeRecoveredData} />}
      {testData && <LineChart data={testData} />} */}
      <div style={{ margin: 100 }}>
        <MapWithCircles />
      </div>
    </div>
  );
};

export default App;
