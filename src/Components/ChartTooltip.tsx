import React from "react";
import { DateAndCount } from "../types";
import { getMonthName } from "../utils/utils";

interface ChartTooltipProps {
  dataPiece: DateAndCount;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ dataPiece }) => {
  console.log("rendering");
  return (
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
  );
};

export default ChartTooltip;
