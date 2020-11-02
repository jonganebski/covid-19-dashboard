import React from "react";
import theme from "../theme";
import { TDateCount } from "../types";
import { getMonthName } from "../utils/utils";

interface ILineChartProps {
  data: TDateCount[] | null;
  dataPiece: TDateCount | null;
  lineGenerator: d3.Line<TDateCount>;
  coord: { x: number; y: number } | null;
}

const LineChart: React.FC<ILineChartProps> = ({
  data,
  dataPiece,
  lineGenerator,
  coord,
}) => {
  return (
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
          <g
            className="tooltip-group"
            id="tooltip-group"
            transform="translate(-80, -60)"
            pointerEvents="none"
          >
            <rect
              className="tooltip-rect"
              width="70"
              height="50"
              fill="black"
              opacity="0.8"
              rx="5"
            ></rect>
            <text transform="translate(5, 20)" fontSize="12px" fill="white">
              {new Date(dataPiece.date).getDate()}{" "}
              {getMonthName(new Date(dataPiece.date).getMonth())}
            </text>
            <text transform="translate(5, 40)" fontSize="12px" fill="white">
              {dataPiece.count.toLocaleString()}
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

export default LineChart;
