import React from "react";
import theme from "../theme";
import { TCoord, TDateCount } from "../types";
import ChartTooltip from "./ChartTooltip";

interface ILineChartProps {
  data: TDateCount[] | null;
  dataPiece: TDateCount | null;
  lineGenerator: d3.Line<TDateCount>;
  coord: TCoord | null;
}

const LineChart: React.FC<ILineChartProps> = ({
  data,
  dataPiece,
  lineGenerator,
  coord,
}) => {
  return (
    <>
      <g className="linegraph-group">
        {data && lineGenerator(data) && (
          <path
            d={lineGenerator(data) as string}
            stroke={theme.colors.yellow[200]}
            fill="none"
          />
        )}
        {coord && dataPiece && (
          <g transform={`translate(${coord.x}, ${coord.y})`}>
            <circle r="4" fill="yellow"></circle>
            <ChartTooltip dataPiece={dataPiece} />
          </g>
        )}
      </g>
    </>
  );
};

export default LineChart;
