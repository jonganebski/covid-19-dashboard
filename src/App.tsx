import * as d3 from "d3";
import { mouse } from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Reset } from "styled-reset";

interface D {
  date: number;
  confirmed: number;
}

const BoundGroup = styled.g``;
const XAxisGroup = styled.g``;
const YAxisGroup = styled.g``;
const LineGraphGroup = styled.g``;

const getData = async () => {
  const loadedData = await d3.csv("time_series_covid19_confirmed_global.csv");
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
      confirmed: d[1] ? +d[1] : 0,
    };
  });
  console.log(data);
  return data;
};

const getDomainArray = (data: Array<D>, xValue: (d: D) => number) => {
  const arr = d3.extent(data, xValue);
  if (!arr[0] || !arr[1]) {
    throw Error("Unable to make x scale.");
  } else {
    return arr;
  }
};

const getMax = (data: Array<D>, yValue: (d: D) => number) => {
  const max = d3.max(data, yValue);
  if (typeof max !== "number") {
    throw Error("Unable to make y scale.");
  } else {
    return max;
  }
};

const App = () => {
  const [data, setData] = useState<Array<D> | null>(null);
  const [dataPiece, setDataPiece] = useState<D | null>(null);
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(
    null
  );
  const [y, setY] = useState<number | null>(null);
  const svgW = 1500;
  const svgH = 600;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const innerW = svgW - margin.left - margin.right;
  const innerH = svgH - margin.top - margin.bottom;
  const xValue = (d: D) => d.date;
  const yValue = (d: D) => d.confirmed;
  const xScaleRef = useRef<d3.ScaleTime<number, number>>();
  const yScaleRef = useRef<d3.ScaleLinear<number, number>>();

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  const xTicks = useMemo(() => {
    if (data) {
      xScaleRef.current = d3
        .scaleTime()
        .domain(getDomainArray(data, xValue))
        .range([0, innerW]);
      return xScaleRef.current.ticks().map((v) => ({
        v,
        xOffset: xScaleRef.current!(v),
      }));
    }
  }, [data]);

  const yTicks = useMemo(() => {
    if (data) {
      yScaleRef.current = d3
        .scaleLinear()
        .domain([getMax(data, yValue), 0])
        .range([0, innerH])
        .nice();
      return yScaleRef.current
        .ticks()
        .map((v) => ({ v, yOffset: yScaleRef.current!(v) }));
    }
  }, [data]);

  const lineGenerator = d3
    .line<D>()
    .x((d) => xScaleRef.current!(xValue(d)) ?? 0)
    .y((d) => yScaleRef.current!(yValue(d)) ?? 0)
    .curve(d3.curveBasis);

  const handleMouseMove = (e: any) => {
    setMouseCoord({ x: e.screenX - margin.left, y: e.screenY - 150 });
    const hoveredDate = xScaleRef.current?.invert(e.screenX - 50).getTime();
    const bs = d3.bisector((d: D) => d.date);
    const i = bs.left(data!, hoveredDate, 1);
    setY(yScaleRef.current!(data![i].confirmed)!);
    setDataPiece(data![i]);
    console.log(data![i]);
    return;
  };
  console.log("rendered");
  return (
    <>
      <Reset />
      <div className="App">
        <svg width={svgW} height={svgH}>
          <BoundGroup
            width={innerW}
            height={innerH}
            transform={`translate(${margin.left}, ${margin.top})`}
          >
            <rect
              width={innerW}
              height={innerH}
              opacity="0"
              onMouseMove={handleMouseMove}
            />
            <XAxisGroup transform={`translate(0, ${innerH})`}>
              <path d={`M 0 0 L ${innerW} 0`} stroke="currentColor" />
              {xTicks &&
                xTicks.map(({ v, xOffset }, i) => (
                  <g key={i} transform={`translate(${xOffset}, 0)`}>
                    <line y2="6" stroke="currentColor" />
                    <line
                      y2={-innerH}
                      stroke="lightgray"
                      strokeDasharray="5, 5"
                    />
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
              {mouseCoord && (
                <line
                  x1={mouseCoord.x}
                  x2={mouseCoord.x}
                  y1="0"
                  y2={-innerH}
                  stroke="currentColor"
                />
              )}
            </XAxisGroup>
            <YAxisGroup>
              <path d={`M 0 0 L 0 ${innerH}`} stroke="currentColor" />
              {yTicks &&
                yTicks.map(({ v, yOffset }, i) => (
                  <g key={i} transform={`translate(0, ${yOffset})`}>
                    <line x2="-6" stroke="currentColor" />
                    <line
                      x2={innerW}
                      stroke="lightgray"
                      strokeDasharray="5, 5"
                    />
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
            </YAxisGroup>
            <LineGraphGroup>
              {data && (
                <path
                  d={lineGenerator(data)!}
                  stroke="currentColor"
                  fill="none"
                />
              )}
              {mouseCoord && y && (
                <g transform={`translate(${mouseCoord.x}, ${y})`}>
                  <circle r="4" fill="black"></circle>
                  <g transform="translate(-120, -70)">
                    <rect
                      width="100"
                      height="50"
                      transform="translate()"
                      fill="tomato"
                      opacity="0.5"
                    ></rect>
                    <text transform="translate(0, 20)">
                      {new Date(dataPiece!.date!).getMonth() + 1}/
                      {new Date(dataPiece!.date!).getDate()}
                    </text>
                    <text transform="translate(0, 40)">
                      {dataPiece!.confirmed!}
                    </text>
                  </g>
                </g>
              )}
            </LineGraphGroup>
          </BoundGroup>
        </svg>
      </div>
    </>
  );
};

export default App;
