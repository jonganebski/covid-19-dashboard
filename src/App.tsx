import { Box, Flex, Grid, Heading } from "@chakra-ui/core";
import * as d3 from "d3";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import React, { useEffect, useState } from "react";
import CenterColumn from "./Components/CenterColumn";
import LeftColumn from "./Components/LeftColumn";
import RightColumn from "./Components/RightColumn";

export interface IDateCount {
  date: number;
  count: number;
}

interface I {
  Cases: number;
  City: string;
  CityCode: string;
  Country: string;
  CountryCode: string;
  Date: string;
  Lat: string;
  Lon: string;
  Province: string;
  Status: string;
}

export type TdataForMap = Array<{
  countryCode: any;
  feature: Feature<Geometry, GeoJsonProperties>;
  data: any;
}>;

// export type TTimeseriesD = { date: number | null; count: number | null };
export type TMainD = {
  CountryRegion: string;
  ProvinceState: string;
  Lat: number | null;
  Long: number | null;
  data: IDateCount[];
};

export type TDailyD = {
  Country_Region: string;
  Last_Update: string;
  Active: number;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Lat: number;
  Long_: number;
  Admin2: string;
  CaseFatality_Ratio: number;
  Combined_Key: string;
  FIPS: string;
  Incidence_Rate: number;
  Province_State: string;
};

function compareDailyData(a: TDailyD, b: TDailyD) {
  // Use toUpperCase() to ignore character casing
  const bandA = a.Country_Region.toUpperCase();
  const bandB = b.Country_Region.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

const getDailyData = async (filename: string) => {
  const loadedData = await d3.csv(filename);
  // console.log("loadedData: ", loadedData);
  const dailyRegionData: TDailyD[] = loadedData.map((d) => ({
    Country_Region: d.Country_Region ?? "",
    Active: d.Active ? +d.Active : 0,
    Confirmed: d.Confirmed ? +d.Confirmed : 0,
    Deaths: d.Deaths ? +d.Deaths : 0,
    Recovered: d.Recovered ? +d.Recovered : 0,
    Lat: d.Lat ? +d.Lat : 0,
    Long_: d.Long_ ? +d.Long_ : 0,
    Last_Update: d.Last_Update ?? "",
    Admin2: d.Admin2 ?? "",
    CaseFatality_Ratio: d["Case-Fatality_Ratio"]
      ? +d["Case-Fatality_Ratio"]
      : 0,
    Combined_Key: d.Combined_Key ?? "",
    FIPS: d.FIPS ?? "",
    Incidence_Rate: d.Incident_Rate ? +d.Incident_Rate : 0,
    Province_State: d.Province_State ?? "",
  }));
  dailyRegionData.sort(compareDailyData);
  dailyRegionData.push({ ...dailyRegionData[0] });
  // console.log("dailyRegionData: ", dailyRegionData);

  const dailyCountryData: TDailyD[] = [];
  dailyRegionData.reduce((acc, d) => {
    if (acc.Country_Region === d.Country_Region) {
      acc.Active = acc.Active + d.Active;
      acc.Confirmed = acc.Confirmed + d.Confirmed;
      acc.Deaths = acc.Deaths + d.Deaths;
      acc.Recovered = acc.Recovered + d.Recovered;
      acc.Admin2 = "";
      acc.CaseFatality_Ratio = 0;
      acc.Combined_Key = "";
      acc.FIPS = "";
      acc.Province_State = "";
    } else {
      dailyCountryData.push(acc);
      acc = d;
    }
    return acc;
  });
  dailyRegionData.pop();
  console.log(dailyCountryData);
  return { dailyCountryData, dailyRegionData };
};

const getTimeSeriesData = async (fileName: string) => {
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
      console.log("same");
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

const App = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TMainD[] | null>(null);
  const [dailyData, setDailyData] = useState<{
    dailyCountryData: TDailyD[];
    dailyRegionData: TDailyD[];
  } | null>(null);
  console.log("timeSeriesData: ", timeSeriesData);
  useEffect(() => {
    // ----------- 데이터 로드 -----------
    getTimeSeriesData("time_series_covid19_confirmed_global.csv").then((data) =>
      setTimeSeriesData(data)
    );
    getDailyData(
      "10-02-2020.csv"
    ).then(({ dailyCountryData, dailyRegionData }) =>
      setDailyData({ dailyCountryData, dailyRegionData })
    );
  }, []);

  return (
    <div
      className="App"
      style={{
        padding: "5px",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <Grid
        w="100%"
        gap={1}
        style={{
          gridTemplate: `"header header header" 5vh
                          "left center right" 94vh / 3fr 9fr 5fr`,
        }}
      >
        <Flex gridArea="header" justify="center" bg="blue.500">
          <Heading> Covid-19 Information Dashboard</Heading>
        </Flex>
        <LeftColumn data={dailyData} />
        {/* <CenterColumn dataForMap={dataForMap} /> */}
        <RightColumn dailyData={dailyData} timeSeriesData={timeSeriesData} />
      </Grid>
    </div>
  );
};

export default App;
