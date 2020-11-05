import { useTheme } from "@chakra-ui/core";
import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTimeSeriesDataCtx } from "../contexts/dataContext";
import { ITimeDataState, TChartTab, TDateCount } from "../types";
import { getMonthName } from "../utils/utils";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

interface ChartContainerProps {
  selected: string;
  svgContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  chartTab: TChartTab;
}

// ----------- FUNCTION -----------

const numberToKMB = (num: number) => {
  if (num < 10 ** 3) {
    return num;
  } else if (10 ** 3 <= num && num < 10 ** 6) {
    return (num / 10 ** 3).toString() + "K";
  } else if (10 ** 6 <= num && num < 10 ** 9) {
    return (num / 10 ** 6).toString() + "M";
  } else {
    return (num / 10 ** 9).toString() + "B";
  }
};

// d3.extent() 에서 [undefined, undefined]가 나오는 경우를 배제하는 함수다.
const getDomainArray = (
  data: Array<TDateCount>,
  xValue: (d: TDateCount) => number
) => {
  const arr = d3.extent(data, xValue);
  if (!arr[0] || !arr[1]) {
    throw Error("Unable to make x scale.");
  } else {
    return arr;
  }
};

// d3.max() 에서 undefined가 나오는 경우를 배제하는 함수다.
const getMax = (data: Array<TDateCount>, yValue: (d: TDateCount) => number) => {
  const max = d3.max(data, yValue);
  if (typeof max !== "number") {
    throw Error("Unable to make y scale.");
  } else {
    return max;
  }
};

const getLineChartData = (
  selected: string,
  chartTab: TChartTab,
  timeData: ITimeDataState
): TDateCount[] | null => {
  if (chartTab === "confirmed" || chartTab === "deaths") {
    if (!selected) {
      return timeData[chartTab].global ?? null;
    } else {
      return (
        timeData[chartTab].countries?.find((d) => d.country === selected)
          ?.data ?? null
      );
    }
  } else {
    return null;
  }
};

const getBarChartData = (
  selected: string,
  chartTab: TChartTab,
  timeData: ITimeDataState
): TDateCount[] | null => {
  const barChartData: ITimeDataState = { ...timeData };
  const returnData: TDateCount[] = [];
  if (chartTab === "daily cases") {
    if (!selected) {
      const targetData = barChartData.confirmed.global;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    } else {
      const targetData = barChartData.confirmed.countries?.find(
        (d) => d.country === selected
      )?.data;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    }
  } else if (chartTab === "daily deaths") {
    if (!selected) {
      const targetData = barChartData.deaths.global;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    } else {
      const targetData = barChartData.deaths.countries?.find(
        (d) => d.country === selected
      )?.data;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};

// ----------- COMPONENT-----------

const ChartContainer: React.FC<ChartContainerProps> = ({
  selected,
  svgContainerRef,
  chartTab,
}) => {
  const theme = useTheme();
  const [data, setData] = useState<TDateCount[]>([]);
  const [dataPiece, setDataPiece] = useState<TDateCount | null>(null);
  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [svgW, setSvgW] = useState(0);
  const [svgH, setSvgH] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipG = d3.select("#tooltip-group");

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };
  const innerW = svgW - margin.left - margin.right;
  const innerH = svgH - margin.top - margin.bottom;
  const xValue = (d: TDateCount) => d.date;
  const yValue = (d: TDateCount) => d.count;
  const xScaleRef = useRef<d3.ScaleTime<number, number> | null>(null);
  const yScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);

  // const xBarScaleRef = useRef<d3.ScaleBand<string> | null>(null);
  // const yBarScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);

  // useEffect(() => {
  //   switch (chartTab) {
  //     case "confirmed":
  //       setData(() => {
  //         if (selected) {
  //           return (
  //             countryConfirmedTimeSeries.find((d) => d.country === selected)
  //               ?.data ?? []
  //           );
  //         } else {
  //           return globalConfirmed;
  //         }
  //       });
  //       break;
  //     case "deaths":
  //       setData(() => {
  //         if (selected) {
  //           return (
  //             countriesDeaths.find((d) => d.country === selected)?.data ?? []
  //           );
  //         } else {
  //           return globalDeaths;
  //         }
  //       });
  //       break;
  //     case "daily cases":
  //       // setData(getBarChartData(selected, chartTab, timeData));
  //       break;
  //     case "daily deaths":
  //       // setData(getBarChartData(selected, chartTab, timeData));
  //       break;
  //   }
  // }, [
  //   chartTab,
  //   countryConfirmedTimeSeries,
  //   countriesDeaths,
  //   globalConfirmed,
  //   globalDeaths,
  //   selected,
  // ]);

  // xBarScaleRef.current = d3
  //   .scaleBand()
  //   .domain(data!.map((d) => xValue(d).toString()))
  //   .range([0, innerW]);

  // yBarScaleRef.current = d3
  //   .scaleLinear()
  //   .domain([0, getMax(data!, yValue)])
  //   .range([innerH, 0]);

  const handleResize = () => {
    const svgParentW = svgRef.current?.parentElement?.getBoundingClientRect()
      .width;
    const svgParentH = svgRef.current?.parentElement?.getBoundingClientRect()
      .height;
    const svgW = svgParentW ?? 0;
    const svgH = svgParentH ?? 0;
    // console.log(svgW, svgH);
    setSvgW(svgW);
    setSvgH(svgH);
  };

  useEffect(() => {
    const svgParentW = svgRef.current?.parentElement?.getBoundingClientRect()
      .width;
    const svgParentH = svgRef.current?.parentElement?.getBoundingClientRect()
      .height;
    const svgW = svgParentW ?? 0;
    const svgH = svgParentH ?? 0;
    setSvgW(svgW);
    setSvgH(svgH);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const xTicks = useMemo(() => {
    if (data.length > 0) {
      xScaleRef.current = d3
        .scaleTime()
        .domain(getDomainArray(data, xValue))
        .range([0, innerW]);
      const ticksArr = xScaleRef.current.ticks().map((v) => ({
        v,
        xOffset: xScaleRef.current!(v),
      }));
      return ticksArr;
    }
  }, [data, innerW]);

  const yTicks = useMemo(() => {
    if (data.length > 0) {
      yScaleRef.current = d3
        .scaleLinear()
        .domain([getMax(data, yValue), 0])
        .nice()
        .range([0, innerH]);
      const ticksArr = yScaleRef.current
        .ticks(5)
        .map((v) => ({ v, yOffset: yScaleRef.current!(v) }));
      return ticksArr;
    }
  }, [data, innerH]);

  const lineGenerator = d3
    .line<TDateCount>()
    .x((d) => xScaleRef.current!(xValue(d)) ?? 0)
    .y((d) => yScaleRef.current!(yValue(d)) ?? 0)
    .curve(d3.curveBasis);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (xScaleRef.current && yScaleRef.current && data) {
      const elementCoord = e.currentTarget.getBoundingClientRect();
      const hoveredDate = xScaleRef.current
        .invert(e.clientX - elementCoord.x)
        .getTime();
      const bs = d3.bisector((d: TDateCount) => d.date);
      const i = bs.left(data, hoveredDate, 1);
      const x = e.clientX - elementCoord.x;
      const y = yScaleRef.current(data[i].count);
      if (y) {
        setCoord({ x, y });
        setDataPiece(data[i]);
      }
      if (x < 100) {
        tooltipG.attr("transform", "translate(20, -60)");
      } else if (100 <= x) {
        tooltipG.attr("transform", "translate(-80, -60)");
      }
      if (y && y <= 60) {
        tooltipG.attr("transform", "translate(-80, 0)");
      }
    }
    return;
  };

  return (
    <>
      <svg ref={svgRef} viewBox={`0 0 ${svgW} ${svgH}`}>
        <g
          className="bound-group"
          width={innerW}
          height={innerH}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <rect
            className="mouse-listener"
            width={Math.abs(innerW)}
            height={Math.abs(innerH)}
            opacity="0"
            onMouseMove={handleMouseMove}
          />
          <g className="x-axis-group" transform={`translate(0, ${innerH})`}>
            <path d={`M 0 0 L ${innerW} 0`} stroke="white" />
            {xTicks &&
              xTicks.map(({ v, xOffset }, i) => (
                <g key={i} transform={`translate(${xOffset}, 0)`}>
                  <line y2="6" stroke="white" />
                  <line
                    y2={-innerH}
                    stroke={theme.colors.gray[600]}
                    strokeDasharray="5, 5"
                  />
                  <text
                    fill={theme.colors.gray[200]}
                    style={{
                      fontSize: "10px",
                      textAnchor: "middle",
                      transform: "translateY(20px)",
                    }}
                  >
                    {getMonthName(v.getMonth())}
                  </text>
                </g>
              ))}
            {coord && (
              <line
                x1={coord.x}
                x2={coord.x}
                y1="0"
                y2={-innerH}
                stroke={theme.colors.gray[200]}
              />
            )}
          </g>
          <g className="y-axis-group">
            <path d={`M 0 0 L 0 ${innerH}`} stroke="white" />
            {yTicks &&
              yTicks.map(({ v, yOffset }, i, arr) => {
                const lastIndex = arr.length - 1;
                return (
                  i !== lastIndex && (
                    <g key={i} transform={`translate(0, ${yOffset})`}>
                      <line x2="-6" stroke="white" />
                      <line
                        x2={innerW}
                        stroke={theme.colors.gray[600]}
                        strokeDasharray="5, 5"
                      />
                      <text
                        fill={theme.colors.gray[200]}
                        style={{
                          fontSize: "10px",
                          textAnchor: "middle",
                          transform: "translate(-25px, 3px)",
                        }}
                      >
                        {numberToKMB(v)}
                      </text>
                    </g>
                  )
                );
              })}
          </g>
          {(chartTab === "confirmed" || chartTab === "deaths") && (
            <LineChart
              data={data}
              dataPiece={dataPiece}
              lineGenerator={lineGenerator}
              coord={coord}
            />
          )}
          {/* {(chartTab === "daily cases" || chartTab === "daily deaths") && (
            <BarChart
              data={data}
              innerW={innerW}
              innerH={innerH}
              getMax={getMax}
              chartTab={chartTab}
            />
          )} */}
        </g>
      </svg>
    </>
  );
};

export default ChartContainer;
