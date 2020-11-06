import * as d3 from "d3";
import { TDateCount } from "../types";

export const useLineChart = (
  xScaleRef: React.MutableRefObject<d3.ScaleTime<number, number> | null>,
  yScaleRef: React.MutableRefObject<d3.ScaleLinear<number, number> | null>,
  xValue: (d: TDateCount) => number,
  yValue: (d: TDateCount) => number,
  data: TDateCount[] | null,
  setCoord: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    } | null>
  >,
  setDataPiece: React.Dispatch<React.SetStateAction<TDateCount | null>>
) => {
  const tooltipG = d3.select("#tooltip-group");

  const lineGenerator = d3
    .line<TDateCount>()
    .x((d) => xScaleRef.current!(xValue(d)) ?? 0)
    .y((d) => yScaleRef.current!(yValue(d)) ?? 0)
    .curve(d3.curveBasis);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (xScaleRef.current && yScaleRef.current && data) {
      const elementCoord = e.currentTarget.getBoundingClientRect();
      const hoveredDate = xScaleRef.current
        .invert(e.clientX - elementCoord.x)
        .getTime();
      const bs = d3.bisector((d: TDateCount) => d.date);
      const i = bs.left(data, hoveredDate, 1);
      const x = e.clientX - elementCoord.x;
      const y = yScaleRef.current(data[i].count);
      if (y) {
        setCoord({ x, y });
        setDataPiece(data[i]);
      }
      if (x < 100) {
        tooltipG.attr("transform", "translate(20, -60)");
      } else if (100 <= x) {
        tooltipG.attr("transform", "translate(-80, -60)");
      }
      if (y && y <= 60) {
        tooltipG.attr("transform", "translate(-80, 0)");
      }
    }
    return;
  };
  return { lineGenerator, handleMouseMove };
};
