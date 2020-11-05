import * as d3 from "d3";
import { useEffect, useState } from "react";
import { numOrNull } from "../api/dailyDataFns";
import { TReferenceD } from "../types";

const referenceCsvUrl =
  process.env.NODE_ENV === "development"
    ? "UID_ISO_FIPS_LookUp_Table.csv"
    : "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv";

export const useReferenceData = (): [TReferenceD[] | null] => {
  const [referenceData, setReferenceData] = useState<TReferenceD[] | null>(
    null
  );

  useEffect(() => {
    d3.csv(referenceCsvUrl, (row) => {
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
