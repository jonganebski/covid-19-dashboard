import * as d3 from "d3";
import { DateAndCount } from "../types";

export const useLineChart = (
  xScaleRef: React.MutableRefObject<d3.ScaleTime<number, number> | null>,
  yScaleRef: React.MutableRefObject<d3.ScaleLinear<number, number> | null>,
  xValue: (d: DateAndCount) => number,
  yValue: (d: DateAndCount) => number
) => {
  const lineGenerator = d3
    .line<DateAndCount>()
    .x((d) => xScaleRef.current!(xValue(d)) ?? 0)
    .y((d) => yScaleRef.current!(yValue(d)) ?? 0)
    .curve(d3.curveBasis);

  return { lineGenerator };
};
