import React, { useEffect, useMemo, useRef, useState } from "react";
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

const initialCountryData = {
  ProvinceOrState: null,
  CountryOrRegion: null,
  Lat: null,
  Long: null,
  dataByDate: [],
};

const getData = async () => {
  const loadedData = await d3.csv("time_series_covid19_confirmed_global.csv");
  console.log(loadedData[0]);
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
  const [data, setData] = useState<Array<countryDataI>>([initialCountryData]);
  const svgW = 1500;
  const svgH = 600;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const innerW = svgW - margin.left - margin.right;
  const innerH = svgH - margin.top - margin.bottom;
  const xValue = (d: dType) => d.date;
  const yValue = (d: dType) => d.confirmed;

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  const xTicks = useMemo(() => {
    if (data.length === 1) {
      return null;
    }
    const xScale = d3
      .scaleTime()
      .domain(getDomainArray(data[0].dataByDate, xValue))
      .range([0, innerW]);
    return xScale.ticks().map((v) => ({
      v,
      xOffset: xScale(v),
    }));
  }, [data]);

  const yTicks = useMemo(() => {
    if (data.length === 1) {
      return null;
    }
    const yScale = d3
      .scaleLinear()
      .domain([getMax(data[0].dataByDate, yValue), 0])
      .range([0, innerH]);
    return yScale.ticks().map((v) => ({ v, yOffset: yScale(v) }));
  }, [data]);

  return (
    <>
      <Reset />
      <div className="App">
        <svg width={svgW} height={svgH}>
          <g
            width={innerW}
            height={innerH}
            transform={`translate(${margin.left}, ${margin.top})`}
          >
            <g transform={`translate(0, ${innerH})`}>
              <path d={`M 0 0 L ${innerW} 0`} stroke="currentColor" />
              {xTicks &&
                xTicks.map(({ v, xOffset }, i) => (
                  <g key={i} transform={`translate(${xOffset}, 0)`}>
                    <line y2="6" stroke="currentColor" />
                    <text
                      key={i}
                      style={{
                        fontSize: "10px",
                        textAnchor: "middle",
                        transform: "translateY(20px)",
                      }}
                    >
                      {v.getMonth() + 1}/{v.getDate()}
                    </text>
                  </g>
                ))}
            </g>
            <g>
              <path d={`M 0 0 L 0 ${innerH}`} stroke="currentColor" />
              {yTicks &&
                yTicks.map(({ v, yOffset }, i) => (
                  <g key={i} transform={`translate(0, ${yOffset})`}>
                    <line x2="-6" stroke="currentColor" />
                    <text
                      key={i}
                      style={{
                        fontSize: "10px",
                        textAnchor: "middle",
                        transform: "translate(-25px, 3px)",
                      }}
                    >
                      {v}
                    </text>
                  </g>
                ))}
            </g>
          </g>
        </svg>
      </div>
    </>
  );
};

export default App;
