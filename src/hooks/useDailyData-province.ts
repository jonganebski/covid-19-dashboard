import * as d3 from "d3";
import { useEffect, useState } from "react";
import { TDailyD } from "../types";
import { numOrNull } from "../utils/utils";

const rowValidator = (row: d3.DSVRowString<string>): [string, TDailyD?] => {
  const country = row.Country_Region;
  const combinedKey = row.Combined_Key;
  const lastUpdate = row.Last_Update;
  const newCasesLastUpdate = "";
  const admin2 = row.Admin2;
  const FIPS = row.FIPS;
  const province = row.Province_State;
  const active = numOrNull(row.Active);
  const confirmed = numOrNull(row.Confirmed);
  const deaths = numOrNull(row.Deaths);
  const recovered = numOrNull(row.Recovered);
  const newCases = null;
  const lat = numOrNull(row.Lat);
  const lon = numOrNull(row.Long_);
  const caseFatalityRatio = numOrNull(row["Case-Fatality_Ratio"]);
  const incidenceRate = numOrNull(row.Incident_Rate);
  if (
    typeof country === "undefined" ||
    typeof combinedKey === "undefined" ||
    typeof lastUpdate === "undefined" ||
    typeof admin2 === "undefined" ||
    typeof FIPS === "undefined" ||
    typeof province === "undefined"
  ) {
    return [`Some data are missing.`];
  } else {
    return [
      "",
      {
        country,
        combinedKey,
        lastUpdate,
        newCasesLastUpdate,
        admin2,
        FIPS,
        province,
        active,
        confirmed,
        deaths,
        recovered,
        newCases,
        lat,
        lon,
        caseFatalityRatio,
        incidenceRate,
      },
    ];
  }
};

export const useDailyProvince = (
  url: string,
  yesterdayData?: TDailyD[] | null
): [boolean, string, TDailyD[] | null] => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [provinceData, setProvinceData] = useState<TDailyD[] | null>(null);
  useEffect(() => {
    const computeNewCases = (
      todayData: TDailyD[],
      yesterdayData: TDailyD[]
    ) => {
      todayData.forEach((D) => {
        const key = D.combinedKey;
        const todayDate = todayData.find((d) => d.combinedKey === key)
          ?.lastUpdate;
        const todayConfirmed = todayData.find((d) => d.combinedKey === key)
          ?.confirmed;
        const yesterdayConfirmed = yesterdayData.find(
          (d) => d.combinedKey === key
        )?.confirmed;
        if (yesterdayConfirmed && todayConfirmed) {
          D.newCases = todayConfirmed - yesterdayConfirmed;
        }
        D.newCasesLastUpdate = todayDate ?? "";
      });
    };

    const getProvinceData = async (url: string) => {
      const data = await d3.csv(url, (row) => {
        try {
          const [err, validRow] = rowValidator(row);
          if (err) {
            throw new Error(err);
          }
          return validRow;
        } catch (err) {
          setError(err);
        }
      });
      if (yesterdayData) {
        computeNewCases(data, yesterdayData);
      }
      setProvinceData(data);
    };

    if (url) {
      setIsLoading(true);
      getProvinceData(url);
      setIsLoading(false);
    }
  }, [url, yesterdayData]);
  return [isLoading, error, provinceData];
};
