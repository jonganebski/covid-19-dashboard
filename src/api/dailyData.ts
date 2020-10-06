import { TReferenceD, TTimeseriesD, TDateCount, TDailyD } from "../types";
import * as d3 from "d3";

export const getDailyData = async (filename: string) => {
  const loadedData = await d3.csv(filename);
  const lookUpTable = await d3.csv("UID_ISO_FIPS_LookUp_Table.csv");

  console.log("loadedData: ", loadedData);
  const mixedCountries: Set<string> = new Set();
  const numOrNull = (value: string | undefined) => (value ? +value : null);

  const referenceData: TReferenceD[] = lookUpTable.map((d) => {
    const Country_Region = d.Country_Region ?? "";
    const Province_State = d.Province_State ?? "";
    const Admin2 = d.Admin2 ?? "";
    const iso2 = d.iso2 ?? "";
    const Lat = numOrNull(d.Lat);
    const Long_ = numOrNull(d.Long_);
    const Population = numOrNull(d.Population);
    const UID = numOrNull(d.UID);
    return {
      Country_Region,
      Province_State,
      Admin2,
      iso2,
      Lat,
      Long_,
      Population,
      UID,
    };
  });

  const provinceWise = loadedData.map((d, i, arr) => {
    if (0 < i && d.Country_Region === arr[i - 1].Country_Region) {
      mixedCountries.add(d.Country_Region ?? "");
    }
    return {
      Country_Region: d.Country_Region ?? "",
      Last_Update: d.Last_Update ?? "",
      Admin2: d.Admin2 ?? "",
      Combined_Key: d.Combined_Key ?? "",
      FIPS: d.FIPS ?? "",
      Province_State: d.Province_State ?? "",
      Active: numOrNull(d.Active),
      Confirmed: numOrNull(d.Confirmed),
      Deaths: numOrNull(d.Deaths),
      Recovered: numOrNull(d.Recovered),
      Lat: numOrNull(d.Lat),
      Long_: numOrNull(d.Long_),
      CaseFatality_Ratio: numOrNull(d["Case-Fatality_Ratio"]),
      Incidence_Rate: numOrNull(d.Incident_Rate),
    };
  });

  const cleanData: TDailyD[] = [];
  const dirtyData: TDailyD[] = [];
  provinceWise.forEach((d) => {
    if (mixedCountries.has(d.Country_Region)) {
      dirtyData.push(d);
    } else {
      cleanData.push(d);
    }
  });

  const sumValueOrNull = (a: number | null, b: number | null) => {
    if (a === null || b === null) {
      return null;
    } else {
      return a + b;
    }
  };

  const getCoordOrNull = (
    reference: TReferenceD[],
    targetCountry: string,
    type: "Lat" | "Long_"
  ) => {
    const targetRow = reference.find(
      (d) => d.Country_Region === targetCountry && d.Province_State === ""
    );
    if (targetRow) {
      return targetRow[type];
    } else {
      console.log("Some missing coords...");
      return null;
    }
  };

  const cleanedData = Array.from(mixedCountries).map((countryName) => {
    return dirtyData
      .filter((d) => d.Country_Region === countryName)
      .reduce((acc, d) => {
        acc = {
          Country_Region: d.Country_Region,
          Active: sumValueOrNull(acc.Active, d.Active),
          Confirmed: sumValueOrNull(acc.Confirmed, d.Confirmed),
          Deaths: sumValueOrNull(acc.Deaths, d.Deaths),
          Recovered: sumValueOrNull(acc.Recovered, d.Recovered),
          Last_Update: d.Last_Update,
          Lat: getCoordOrNull(referenceData, d.Country_Region, "Lat"),
          Long_: getCoordOrNull(referenceData, d.Country_Region, "Long_"),
          FIPS: "",
          Incidence_Rate: null,
          CaseFatality_Ratio: null,
          Combined_Key: "",
          Admin2: "",
          Province_State: "",
        };
        return acc;
      });
  });

  const countryWise = cleanData.concat(cleanedData);
  console.log("getting countryWise data...: ", countryWise);
  console.log("getting provinceWise data...: ", provinceWise);
  console.log(
    "reference data-france: ",
    referenceData.filter((d) => d.Country_Region === "France")
  );
  return { countryWise, provinceWise };
};
