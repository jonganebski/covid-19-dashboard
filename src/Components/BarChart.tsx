import React, { useMemo } from "react";
import { TChartTab, TDateCount } from "../types";
import * as d3 from "d3";
import { useTheme } from "@chakra-ui/core";

interface IBarCartProps {
  data: TDateCount[] | null;
  innerW: number;
  innerH: number;
  getMax: (
    data: Array<TDateCount>,
    yValue: (d: TDateCount) => number
  ) => number;
  chartTab: TChartTab;
}

const BarChart: React.FC<IBarCartProps> = ({
  data,
  innerW,
  innerH,
  getMax,
  chartTab,
}) => {
  const theme = useTheme();
  const xValue = (d: TDateCount) => d.date;
  const yValue = (d: TDateCount) => d.count;

  const xBarScaleRef = useMemo(() => {
    if (data) {
      return d3
        .scaleBand()
        .domain(data!.map((d) => xValue(d).toString()))
        .range([0, innerW]);
    }
  }, [data, innerW]);
  const yBarScaleRef = useMemo(() => {
    if (data) {
      return d3
        .scaleLinear()
        .domain([0, getMax(data!, yValue)])
        .range([innerH, 0])
        .nice();
    }
  }, [data, getMax, innerH]);

  return (
    <g className="bargraph-group">
      {data?.map((d, i) => {
        return (
          <rect
            key={i}
            x={xBarScaleRef?.(xValue(d).toString())}
            y={yBarScaleRef?.(yValue(d)) ?? 0}
            width={xBarScaleRef?.bandwidth()}
            height={innerH - yBarScaleRef?.(yValue(d))!}
            fill={
              chartTab === "daily cases"
                ? theme.colors.pink[400]
                : theme.colors.gray[400]
            }
          ></rect>
        );
      })}
    </g>
  );
};

export default BarChart;
