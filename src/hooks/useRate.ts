import { useEffect, useState } from "react";
import { CountryTimeData, Rate, ReferenceData } from "../types";

export const useRate = (
  reference: ReferenceData[] | null,
  timeData: CountryTimeData[] | null
) => {
  const [perPopulation, setPerPopulation] = useState<Rate[] | null>(null);

  useEffect(() => {
    if (reference && timeData) {
      const result: Rate[] = [];
      timeData.forEach((d) => {
        const country = d.country;
        const population = reference.find((d) => d.country === country)
          ?.population;
        const now = d.data[d.data.length - 1].count;
        const weekBefore = d.data[d.data.length - 7].count;
        if (population) {
          const rate = Math.round(((now - weekBefore) * 100000) / population);
          result.push({ country, rate });
        }
      });
      setPerPopulation(result.filter((d) => 200 <= d.rate));
    }
  }, [timeData, reference]);
  return [perPopulation];
};
