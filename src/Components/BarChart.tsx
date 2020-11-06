import React, { useMemo } from "react";
import { TChartTab, TDateCount } from "../types";
import * as d3 from "d3";
import { useTheme } from "@chakra-ui/core";

interface IBarCartProps {
  data: TDateCount[] | null;
  innerW: number;
  innerH: number;
  chartTab: TChartTab;
  xBarScaleRef: d3.ScaleBand<string> | undefined;
  yBarScaleRef: d3.ScaleLinear<number, number> | undefined;
  xValue: (d: TDateCount) => number;
  yValue: (d: TDateCount) => number;
}

const BarChart: React.FC<IBarCartProps> = ({
  data,
  innerW,
  innerH,
  chartTab,
  xBarScaleRef,
  yBarScaleRef,
  xValue,
  yValue,
}) => {
  const theme = useTheme();

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
