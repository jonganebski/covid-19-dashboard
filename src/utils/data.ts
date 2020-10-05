import { TReferenceD, TDailyCountryD, TMainD, IDateCount } from "../types";
import * as d3 from "d3";

export const getDailyData = async (filename: string) => {
  const loadedData = await d3.csv(filename);
  const lookUpTable = await d3.csv("UID_ISO_FIPS_LookUp_Table.csv");

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

  const cleanData: TDailyCountryD[] = [];
  const dirtyData: TDailyCountryD[] = [];
  provinceWise.forEach((d) => {
    if (mixedCountries.has(d.Country_Region)) {
      dirtyData.push({ ...d, provinceData: [] });
    } else {
      cleanData.push({ ...d, provinceData: null });
    }
  });

  const sumValueOrNull = (a: number | null, b: number | null) => {
    if (a === null || b === null) {
      return null;
    } else {
      return a + b;
    }
  };

  const coordOrNull = (
    reference: TReferenceD[],
    targetCountry: string,
    type: "Lat" | "Long_"
  ) => {
    const row = reference.find(
      (d) => d.Country_Region === targetCountry && d.Province_State === ""
    );
    if (row) {
      return row[type];
    } else {
      throw Error("Reference data has some missing information.");
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
          Lat: coordOrNull(referenceData, d.Country_Region, "Lat"),
          Long_: coordOrNull(referenceData, d.Country_Region, "Long_"),
          FIPS: "",
          Incidence_Rate: null,
          CaseFatality_Ratio: null,
          Combined_Key: "",
          Admin2: "",
          Province_State: "",
          provinceData: provinceWise.filter(
            (country) => country.Country_Region === d.Country_Region
          ),
        };
        return acc;
      });
  });

  const data = cleanData.concat(cleanedData);
  console.log("getting data...: ", data);
  return data;
};

export const getTimeSeriesData = async (fileName: string) => {
  const loadedData = await d3.csv(fileName);
  const D: TMainD = {
    CountryRegion: "",
    ProvinceState: "",
    Lat: 0,
    Long: 0,
    data: [],
  };
  const data = loadedData.map((d) => {
    const timeData: IDateCount[] = [];
    Object.entries(d).forEach(([key, value]) => {
      if (key === "Country/Region") {
        D.CountryRegion = value ?? "";
      } else if (key === "Province/State") {
        D.ProvinceState = value ?? "";
      } else if (key === "Lat") {
        D.Lat = value ? +value : null;
      } else if (key === "Long") {
        D.Long = value ? +value : null;
      } else {
        timeData.push({
          date: new Date(key).getTime() ?? null,
          count: value ? +value : 0,
        });
      }
    });
    return { ...D, data: [...timeData] };
  });
  const countryWise: any = [];
  data.push({
    ProvinceState: "",
    CountryRegion: "",
    Lat: null,
    Long: null,
    data: [],
  });
  data.reduce((acc, d) => {
    if (acc.CountryRegion === d.CountryRegion) {
      // console.log("same");
      acc.ProvinceState = "";
      d.data.forEach((d, i) => {
        acc.data[i].count = (acc.data[i].count ?? 0) + (d.count ?? 0);
      });
    } else {
      countryWise.push(acc);
      acc = d;
    }
    return acc;
  }, data[0]);

  // console.log("countryWise: ", countryWise);
  return countryWise;
};
