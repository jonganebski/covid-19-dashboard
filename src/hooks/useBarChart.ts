import * as d3 from "d3";
import { useMemo } from "react";
import { TDateCount } from "../types";

export const useBarChart = (
  data: TDateCount[] | null,
  xValue: (d: TDateCount) => number,
  yValue: (d: TDateCount) => number,
  innerW: number,
  innerH: number
) => {
  // d3.max() 에서 undefined가 나오는 경우를 배제하는 함수다.
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
  const xBarScaleRef = useMemo(() => {
    if (data) {
      return d3
        .scaleBand()
        .domain(data!.map((d) => xValue(d).toString()))
        .range([0, innerW]);
    }
  }, [data, innerW, xValue]);
  const yBarScaleRef = useMemo(() => {
    if (data) {
      return d3
        .scaleLinear()
        .domain([0, getMax(data, yValue)])
        .range([innerH, 0])
        .nice();
    }
  }, [data, innerH, yValue]);

  return { xBarScaleRef, yBarScaleRef };
};
