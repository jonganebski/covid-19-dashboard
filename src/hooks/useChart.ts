import * as d3 from "d3";
import { useState, useRef, useMemo, useEffect } from "react";
import { useTimeSeriesDataCtx } from "../contexts/dataContext";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { TChartTab, TCountryTimedata, TDateCount } from "../types";

export const useChart = (
  countryConfirmedTimeSeries: TCountryTimedata[] | null,
  globalConfirmedTimeSeries: TDateCount[] | null,
  countryDeathsTimeSeries: TCountryTimedata[] | null,
  globalDeathsTimeSeries: TDateCount[] | null,
  selectedCountry: string,
  chartTab: TChartTab
) => {
  const [data, setData] = useState<TDateCount[] | null>(null);
  const [dataPiece, setDataPiece] = useState<TDateCount | null>(null);
  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [svgW, setSvgW] = useState(0);
  const [svgH, setSvgH] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 20, bottom: 20, left: 60 };
  const innerW = svgW - margin.left - margin.right;
  const innerH = svgH - margin.top - margin.bottom;
  const xValue = (d: TDateCount) => d.date;
  const yValue = (d: TDateCount) => d.count;
  const xScaleRef = useRef<d3.ScaleTime<number, number> | null>(null);
  const yScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);

  useEffect(() => {
    const getLineChartData = (data: TCountryTimedata[]) => {
      return data.find((d) => d.country === selectedCountry)?.data ?? [];
    };
    const getBarChartReturnData = (data: TDateCount[]) => {
      const returnData: TDateCount[] = [];
      returnData.push(data[0]);
      data.reduce((acc, d) => {
        returnData.push({ date: d.date, count: d.count - acc.count });
        return d;
      });
      return returnData;
    };
    const getBarChartData = (data: TCountryTimedata[]) => {
      const targetData = data.find((d) => d.country === selectedCountry)?.data;
      if (targetData) {
        return getBarChartReturnData(targetData);
      } else {
        return [];
      }
    };
    if (
      countryConfirmedTimeSeries &&
      countryDeathsTimeSeries &&
      globalConfirmedTimeSeries &&
      globalDeathsTimeSeries
    ) {
      switch (chartTab) {
        case "confirmed":
          setData(() => {
            if (selectedCountry) {
              return getLineChartData(countryConfirmedTimeSeries);
            } else {
              return globalConfirmedTimeSeries;
            }
          });
          break;
        case "deaths":
          setData(() => {
            if (selectedCountry) {
              return getLineChartData(countryDeathsTimeSeries);
            } else {
              return globalDeathsTimeSeries;
            }
          });
          break;
        case "daily cases":
          setData(() => {
            if (selectedCountry) {
              return getBarChartData(countryConfirmedTimeSeries);
            } else {
              return getBarChartReturnData(globalConfirmedTimeSeries);
            }
          });
          break;
        case "daily deaths":
          setData(() => {
            if (selectedCountry) {
              return getBarChartData(countryDeathsTimeSeries);
            } else {
              return getBarChartReturnData(globalDeathsTimeSeries);
            }
          });
          break;
      }
    }
  }, [
    chartTab,
    countryConfirmedTimeSeries,
    countryDeathsTimeSeries,
    globalConfirmedTimeSeries,
    globalDeathsTimeSeries,
    selectedCountry,
  ]);
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

  const getMax = (
    data: Array<TDateCount>,
    yValue: (d: TDateCount) => number
  ) => {
    const max = d3.max(data, yValue);
    if (typeof max !== "number") {
      throw Error("Unable to make y scale.");
    } else {
      return max;
    }
  };

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
        .nice()
        .range([0, innerH]);
      const ticksArr = yScaleRef.current
        .ticks(5)
        .map((v) => ({ v, yOffset: yScaleRef.current!(v) }));
      return ticksArr;
    }
  }, [data, innerH]);

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

  return {
    data,
    coord,
    setCoord,
    dataPiece,
    setDataPiece,
    handleResize,
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
  };
};