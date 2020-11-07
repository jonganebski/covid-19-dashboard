import { DefaultTheme, useTheme } from "@chakra-ui/core";
import * as d3 from "d3";
import React from "react";
import styled from "styled-components";
import { TChartTab, TCoord, TDateCount } from "../types";
import ChartTooltip from "./ChartTooltip";

interface IBarChartProps {
  data: TDateCount[] | null;
  dataPiece: TDateCount | null;
  innerH: number;
  chartTab: TChartTab;
  xBarScaleRef: d3.ScaleBand<string> | undefined;
  yBarScaleRef: d3.ScaleLinear<number, number> | undefined;
  xValue: (d: TDateCount) => number;
  yValue: (d: TDateCount) => number;
  coord: TCoord | null;
}

interface IBarProps {
  chartTab: TChartTab;
  theme: DefaultTheme;
  barDate: number;
  mouseDate?: number;
}

const Bar = styled.rect<IBarProps>`
  fill: ${({ chartTab, theme, barDate, mouseDate }) => {
    if (chartTab === "daily cases") {
      if (barDate === mouseDate) {
        return "red";
      }
      return theme.colors.pink[400];
    } else {
      if (barDate === mouseDate) {
        return "white";
      }
      return theme.colors.gray[400];
    }
  }};
`;

const BarChart: React.FC<IBarChartProps> = ({
  data,
  dataPiece,
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
        const y = yBarScaleRef?.(yValue(d));
        return (
          x &&
          y && (
            <Bar
              key={i}
              transform={`translate(${x}, ${y})`}
              width={xBarScaleRef?.bandwidth()}
              height={innerH - yBarScaleRef?.(yValue(d))!}
              chartTab={chartTab}
              theme={theme}
              barDate={d.date}
              mouseDate={dataPiece?.date}
            ></Bar>
          )
        );
      })}
      {dataPiece && (
        <g transform={`translate(${coord?.x}, ${coord?.y})`}>
          <ChartTooltip dataPiece={dataPiece} />
        </g>
      )}
    </g>
  );
};

export default BarChart;
