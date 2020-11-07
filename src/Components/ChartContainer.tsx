import { useTheme } from "@chakra-ui/core";
import React from "react";
import { useTimeSeriesDataCtx } from "../contexts/dataContext";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { useBarChart } from "../hooks/useBarChart";
import { useChart } from "../hooks/useChart";
import { useLineChart } from "../hooks/useLineChart";
import { TChartTab } from "../types";
import { getMonthName, numberToKMB } from "../utils/utils";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

interface ChartContainerProps {
  svgContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  chartTab: TChartTab;
}

// ----------- FUNCTION -----------

// ----------- COMPONENT-----------

const ChartContainer: React.FC<ChartContainerProps> = ({
  svgContainerRef,
  chartTab,
}) => {
  const theme = useTheme();
  const {
    countryConfirmedTimeSeries,
    globalConfirmedTimeSeries,
    countryDeathsTimeSeries,
    globalDeathsTimeSeries,
  } = useTimeSeriesDataCtx();
  const { selectedCountry } = useSelectCountryCtx();
  const {
    data,
    coord,
    setCoord,
    dataPiece,
    setDataPiece,
    innerW,
    innerH,
    xValue,
    yValue,
    svgW,
    svgH,
    svgRef,
    margin,
    xScaleRef,
    yScaleRef,
    xTicks,
    yTicks,
  } = useChart(
    countryConfirmedTimeSeries,
    globalConfirmedTimeSeries,
    countryDeathsTimeSeries,
    globalDeathsTimeSeries,
    selectedCountry,
    chartTab
  );
  const { lineGenerator, handleMouseMove } = useLineChart(
    xScaleRef,
    yScaleRef,
    xValue,
    yValue,
    data,
    setCoord,
    setDataPiece
  );
  const { xBarScaleRef, yBarScaleRef } = useBarChart(
    data,
    xValue,
    yValue,
    innerW,
    innerH
  );

  return (
    <>
      <svg ref={svgRef} viewBox={`0 0 ${svgW} ${svgH}`}>
        <g
          className="bound-group"
          width={innerW}
          height={innerH}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
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
          <rect
            className="mouse-listener"
            width={Math.abs(innerW)}
            height={Math.abs(innerH)}
            opacity="0"
            onMouseMove={handleMouseMove}
          />
          {(chartTab === "confirmed" || chartTab === "deaths") && (
            <LineChart
              data={data}
              dataPiece={dataPiece}
              lineGenerator={lineGenerator}
              coord={coord}
              innerW={innerW}
              innerH={innerH}
              handleMouseMove={handleMouseMove}
            />
          )}
          {(chartTab === "daily cases" || chartTab === "daily deaths") && (
            <BarChart
              data={data}
              innerW={innerW}
              innerH={innerH}
              chartTab={chartTab}
              xBarScaleRef={xBarScaleRef}
              yBarScaleRef={yBarScaleRef}
              xValue={xValue}
              yValue={yValue}
              coord={coord}
            />
          )}
        </g>
      </svg>
    </>
  );
};

export default ChartContainer;
