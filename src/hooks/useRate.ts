import { useEffect, useState } from "react";
import { TCountryTimedata, TRate, TReferenceD } from "../types";

export const useRate = (
  reference: TReferenceD[] | null,
  timeData: TCountryTimedata[] | null
) => {
  const [perPopulation, setPerPopulation] = useState<TRate[] | null>(null);

  useEffect(() => {
    if (reference && timeData) {
      const result: TRate[] = [];
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
