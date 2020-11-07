import * as d3 from "d3";
import { useEffect, useState } from "react";
import { REFERENCE_CSV_URL } from "../constants";
import { TReferenceD } from "../types";
import { numOrNull } from "../utils/utils";

export const useReferenceData = (): [TReferenceD[] | null] => {
  const [referenceData, setReferenceData] = useState<TReferenceD[] | null>(
    null
  );

  useEffect(() => {
    d3.csv(REFERENCE_CSV_URL, (row) => {
      return {
        country: row.Country_Region ?? "",
        province: row.Province_State ?? "",
        admin2: row.Admin2 ?? "",
        iso2: row.iso2 ?? "",
        lat: numOrNull(row.Lat),
        lon: numOrNull(row.Long_),
        population: numOrNull(row.Population),
        UID: numOrNull(row.UID),
      };
    }).then((data) => {
      setReferenceData(data);
    });
  }, []);
  return [referenceData];
};
