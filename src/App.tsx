import React, { useEffect } from "react";
import { Reset } from "styled-reset";
import * as d3 from "d3";

type dType = { date: number; confirmed: number | null };

type dataByDateT = Array<dType>;

interface countryDataI {
  ProvinceOrState: string | null;
  CountryOrRegion: string | null;
  Lat: number | null;
  Long: number | null;
  dataByDate: dataByDateT;
}

const getData = async () => {
  const initialCountryData = {
    ProvinceOrState: null,
    CountryOrRegion: null,
    Lat: null,
    Long: null,
    dataByDate: [],
  };
  const loadedData = await d3.csv("time_series_covid19_confirmed_global.csv");
  console.log("loadedData: ", loadedData);
  const countryData: countryDataI = initialCountryData;
  let arr = [];
  const csvData = loadedData.map((d) => {
    arr = [];
    for (const [key, value] of Object.entries(d)) {
      if (key === "Province/State") {
        countryData.ProvinceOrState = value ?? null;
      } else if (key === "Country/Region") {
        countryData.CountryOrRegion = value ?? null;
      } else if (key === "Lat") {
        countryData.Lat = value ? +value : null;
      } else if (key === "Long") {
        countryData.Long = value ? +value : null;
      } else {
        const date = new Date(key).getTime();
        arr.push({
          date,
          confirmed: value ? +value : null,
        });
        countryData.dataByDate = arr;
      }
    }
    return { ...countryData };
  });
  return csvData;
};

const getDomainArray = (data: dataByDateT, xValue: (d: dType) => number) => {
  const arr = d3.extent(data, xValue);
  if (!arr[0] || !arr[1]) {
    throw Error("Unable to make x scale.");
  } else {
    return arr;
  }
};

const getMax = (data: dataByDateT, yValue: (d: dType) => number | null) => {
  const max = d3.max(data, yValue);
  if (typeof max !== "number") {
    throw Error("Unable to make y scale.");
  } else {
    return max;
  }
};

const App = () => {
  useEffect(() => {
    const render = (data: Array<countryDataI>) => {
      console.log("data: ", data);
      const svg = d3.select("svg");
      const svgW = +svg.attr("width");
      const svgH = +svg.attr("height");
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const innerW = svgW - margin.left - margin.right;
      const innerH = svgH - margin.top - margin.bottom;
      const xValue = (d: dType) => d.date;
      const yValue = (d: dType) => d.confirmed;
      const xScale = d3
        .scaleTime()
        .domain(getDomainArray(data[0].dataByDate, xValue))
        .range([0, innerW]);
      const yScale = d3
        .scaleLinear()
        .domain([getMax(data[0].dataByDate, yValue), 0])
        .range([0, innerH]);
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisRight(yScale);
      const g = svg
        .append("g")
        .attr("width", innerW)
        .attr("height", innerH)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const xAxisG = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerH})`);
      const yAxisG = g
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${innerW}, 0)`);
    };
    getData().then((data) => render(data));
  }, []);
  return (
    <>
      <Reset />
      <div className="App">
        <svg width="1000" height="600"></svg>
      </div>
    </>
  );
};

export default App;
