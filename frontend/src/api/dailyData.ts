import * as d3 from "d3";
import { TDailyD, TReferenceD } from "../types";
import { getCountryWise, numOrNull } from "./dailyDataFns";

// ------------- MAIN FUNCTION -------------

export const getDailyData = async (filename: string) => {
  // 지역별 데이터만 있는 나라들의 리스트. 중복 제거를 위해 set 사용.
  const blackSwans: Set<string> = new Set();

  let provinceWise: TDailyD[] = [];
  let referenceData: TReferenceD[] | null = [];
  let countryWise: TDailyD[] | null = [];

  // 1. Getting provinceWise.
  await d3
    .csv(filename, (row) => {
      return {
        country: row.Country_Region ?? "",
        combinedKey: row.Combined_Key ?? "",
        lastUpdate: row.Last_Update ?? "",
        newCasesLastUpdate: "",
        admin2: row.Admin2 ?? "",
        FIPS: row.FIPS ?? "",
        province: row.Province_State ?? "",
        active: numOrNull(row.Active ?? ""),
        confirmed: numOrNull(row.Confirmed ?? ""),
        deaths: numOrNull(row.Deaths ?? ""),
        recovered: numOrNull(row.Recovered ?? ""),
        newCases: null,
        lat: numOrNull(row.Lat ?? ""),
        lon: numOrNull(row.Long_ ?? ""),
        caseFatalityRatio: numOrNull(row["Case-Fatality_Ratio"] ?? ""),
        incidenceRate: numOrNull(row.Incident_Rate ?? ""),
      };
    })
    .then((data) => {
      provinceWise = data;
    });

  // 2. Gettting referenceWise
  await d3
    .csv("UID_ISO_FIPS_LookUp_Table.csv", (row) => {
      return {
        country: row.Country_Region ?? "",
        province: row.Province_State ?? "",
        admin2: row.Admin2 ?? "",
        iso2: row.iso2 ?? "",
        lat: numOrNull(row.Lat ?? ""),
        lon: numOrNull(row.Long_ ?? ""),
        population: numOrNull(row.Population ?? ""),
        UID: numOrNull(row.UID ?? ""),
      };
    })
    .then((data) => {
      referenceData = data;
    });

  // 3. Getting blackSwans
  provinceWise?.forEach((d, i, arr) => {
    if (0 < i && d.country === arr[i - 1].country) {
      blackSwans.add(d.country ?? "");
    }
  });

  // 4. Getting countryWise
  countryWise = getCountryWise(provinceWise, referenceData, blackSwans);

  return { countryWise, provinceWise };
};
