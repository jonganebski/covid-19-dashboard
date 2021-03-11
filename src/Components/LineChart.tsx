import { useTheme } from "@chakra-ui/react";
import React from "react";
import { Coord, DateAndCount } from "../types";
import ChartTooltip from "./ChartTooltip";

interface ILineChartProps {
  data: DateAndCount[] | null;
  dataPiece: DateAndCount | null;
  lineGenerator: d3.Line<DateAndCount>;
  coord: Coord | null;
}

const LineChart: React.FC<ILineChartProps> = ({
  data,
  dataPiece,
  lineGenerator,
  coord,
}) => {
  const theme = useTheme();
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
