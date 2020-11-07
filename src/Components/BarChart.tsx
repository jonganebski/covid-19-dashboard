import { useTheme } from "@chakra-ui/core";
import * as d3 from "d3";
import React from "react";
import styled from "styled-components";
import { TChartTab, TDateCount } from "../types";

interface IBarCartProps {
  data: TDateCount[] | null;
  innerW: number;
  innerH: number;
  chartTab: TChartTab;
  xBarScaleRef: d3.ScaleBand<string> | undefined;
  yBarScaleRef: d3.ScaleLinear<number, number> | undefined;
  xValue: (d: TDateCount) => number;
  yValue: (d: TDateCount) => number;
  coord: {
    x: number;
    y: number;
  } | null;
}

const Rect = styled.rect`
  &:hover {
    fill: red;
  }
`;

const BarChart: React.FC<IBarCartProps> = ({
  data,
  innerW,
  innerH,
  chartTab,
  xBarScaleRef,
  yBarScaleRef,
  xValue,
  yValue,
  coord,
}) => {
  const theme = useTheme();
  return (
    <g className="bargraph-group">
      {data?.map((d, i) => {
        const x = xBarScaleRef?.(xValue(d).toString());
        return (
          x && (
            <Rect
              key={i}
              x={xBarScaleRef?.(xValue(d).toString())}
              y={yBarScaleRef?.(yValue(d)) ?? 0}
              width={xBarScaleRef?.bandwidth()}
              height={innerH - yBarScaleRef?.(yValue(d))!}
              fill={
                chartTab === "daily cases" && coord?.x === Math.round(x)
                  ? "red"
                  : chartTab === "daily deaths" && coord?.x === Math.round(x)
                  ? "white"
                  : chartTab === "daily cases"
                  ? theme.colors.pink[400]
                  : theme.colors.gray[400]
              }
            ></Rect>
          )
        );
      })}
    </g>
  );
};

export default React.memo(BarChart);
