import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { IDateCount } from "../App";
import { getMonthName } from "../utils";

interface LineChartProps {
  data: Array<IDateCount>;
  svgContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const BoundGroup = styled.g``;
const MouseListener = styled.rect``;
const XAxisGroup = styled.g``;
const YAxisGroup = styled.g``;
const LineGraphGroup = styled.g``;
const TooltipGroup = styled.g``;
const TooltipRect = styled.rect``;

// d3.extent() 에서 [undefined, undefined]가 나오는 경우를 배제하는 함수다.
const getDomainArray = (
  data: Array<IDateCount>,
  xValue: (d: IDateCount) => number
) => {
  const arr = d3.extent(data, xValue);
  if (!arr[0] || !arr[1]) {
    throw Error("Unable to make x scale.");
  } else {
    return arr;
  }
};

// d3.max() 에서 undefined가 나오는 경우를 배제하는 함수다.
const getMax = (data: Array<IDateCount>, yValue: (d: IDateCount) => number) => {
  const max = d3.max(data, yValue);
  if (typeof max !== "number") {
    throw Error("Unable to make y scale.");
  } else {
    return max;
  }
};

const LineChart: React.FC<LineChartProps> = ({ data, svgContainerRef }) => {
  const [dataPiece, setDataPiece] = useState<IDateCount | null>(null);
  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [svgW, setSvgW] = useState(0);
  const [svgH, setSvgH] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipG = d3.select("#tooltip-group");

  const margin = { top: 50, right: 0, bottom: 50, left: 50 };
  const innerW = svgW - margin.left - margin.right;
  const innerH = svgH - margin.top - margin.bottom;
  const xValue = (d: IDateCount) => d.date;
  const yValue = (d: IDateCount) => d.count;
  const xScaleRef = useRef<d3.ScaleTime<number, number> | null>(null);
  const yScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);

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
    if (data) {
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
    if (data) {
      yScaleRef.current = d3
        .scaleLinear()
        .domain([getMax(data, yValue), 0])
        .range([0, innerH])
        .nice();
      const ticksArr = yScaleRef.current
        .ticks()
        .map((v) => ({ v, yOffset: yScaleRef.current!(v) }));
      return ticksArr;
    }
  }, [data, innerH]);

  const lineGenerator = d3
    .line<IDateCount>()
    .x((d) => xScaleRef.current!(xValue(d)) ?? 0)
    .y((d) => yScaleRef.current!(yValue(d)) ?? 0)
    .curve(d3.curveBasis);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (xScaleRef.current && yScaleRef.current && data) {
      const elementCoord = e.currentTarget.getBoundingClientRect();
      const hoveredDate = xScaleRef.current
        .invert(e.clientX - elementCoord.x)
        .getTime();
      const bs = d3.bisector((d: IDateCount) => d.date);
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
    }
    return;
  };

  return (
    <>
      {/* <svg ref={svgRef} width={svgW} height={svgH}> */}
      {/* <svg ref={svgRef} viewBox={`0 0 ${svgW} ${svgH}`}> */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidyMid meet"
      >
        <BoundGroup
          width={innerW}
          height={innerH}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <MouseListener
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
                  <line x2={innerW} stroke="lightgray" strokeDasharray="5, 5" />
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
            {data && lineGenerator(data) && (
              <path
                d={lineGenerator(data) as string}
                stroke="currentColor"
                fill="none"
              />
            )}
            {coord && dataPiece && (
              <g transform={`translate(${coord.x}, ${coord.y})`}>
                <circle
                  r="6"
                  fill="none"
                  stroke="steelblue"
                  strokeWidth="3"
                ></circle>
                <TooltipGroup
                  id="tooltip-group"
                  transform="translate(-80, -60)"
                  pointerEvents="none"
                >
                  <TooltipRect
                    width="70"
                    height="50"
                    fill="tomato"
                    opacity="0.5"
                    rx="5"
                  ></TooltipRect>
                  <text transform="translate(5, 20)" fontSize="12px">
                    {new Date(dataPiece.date).getDate()}{" "}
                    {getMonthName(new Date(dataPiece.date).getMonth())}
                  </text>
                  <text transform="translate(5, 40)" fontSize="12px">
                    {dataPiece.count}
                  </text>
                </TooltipGroup>
              </g>
            )}
          </LineGraphGroup>
        </BoundGroup>
      </svg>
    </>
  );
};

export default LineChart;
