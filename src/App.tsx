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

const getApiData = async () => {
  const response = await fetch(
    "https://api.covid19api.com/country/south-africa/status/confirmed"
  );
  const loadedData = await response.json();
  const data: Array<IDateCount> = loadedData.map((d: I) => ({
    date: new Date(d.Date).getTime(),
    count: d.Cases,
  }));
  return data;
};

const getCsvData = async (fileName: string) => {
  const loadedData = await d3.csv(fileName);
  console.log("csvData: ", loadedData);
  const selectedData = loadedData.filter(
    (d) => d["Country/Region"] === "Japan"
  );
  const filteredData = Object.entries(selectedData[0]).filter(([key, _]) => {
    const date = new Date(key);
    if (isNaN(date.getTime())) {
      return false;
    } else {
      return true;
    }
  });
  const data = filteredData.map((d) => {
    const date = new Date(d[0]);
    return {
      date: date.getTime(),
      count: d[1] ? +d[1] : 0,
    };
  });
  return data;
};

// ----------- 함수 -----------
// https://api.covid19api.com 에서는 세계의 시간에 따른 변화를 보여주는 데이터가 없다... 나라별만 있음.
const loadAndProcessData = () => {
  return Promise.all<FeatureCollection, any>([
    d3.json(
      "https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m_countries.geojson"
    ),
    fetch("https://api.covid19api.com/summary").then((response) =>
      response.json()
    ),
  ]).then(([geojsonData, summaryData]) => {
    // console.log("geojsonData: ", geojsonData);
    // console.log("summaryData: ", summaryData);

    const countriesObj = summaryData.Countries?.reduce(
      (acc: { [key: string]: any }, countryD: any) => {
        const countryCode = countryD.CountryCode;
        acc[countryCode] = countryD;
        return acc;
      },
      {}
    );
    // console.log("countriesObj: ", countriesObj);
    const countriesWithFeature = geojsonData.features.map((feature) => {
      const countryCode = feature.properties!.iso_a2;
      return { countryCode, feature, data: countriesObj[countryCode] };
    });
    // console.log("countriesWithFeature: ", countriesWithFeature);

    return { summaryData, countriesWithFeature };
  });
};

const App = () => {
  const [cumulativeCasesData, setCumulativeCasesData] = useState<Array<
    IDateCount
  > | null>(null);
  // const [cumulativeDeathsData, setCumulativeDeathsData] = useState<Array<
  //   IDateCount
  // > | null>(null);
  // const [cumulativeRecoveredData, setCumulativeRecoveredData] = useState<Array<
  //   IDateCount
  // > | null>(null);
  // const [testData, setTestData] = useState<Array<IDateCount> | null>(null);
  const [dataForMap, setDataForMap] = useState<TdataForMap | null>(null);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  useEffect(() => {
    // getCsvData("time_series_covid19_deaths_global.csv").then((data) =>
    //   setCumulativeDeathsData(data)
    // );
    // getCsvData("time_series_covid19_recovered_global.csv").then((data) =>
    //   setCumulativeRecoveredData(data)
    // );
    // getApiData().then((data) => setTestData(data));
  }, []);
  useEffect(() => {
    // ----------- 데이터 로드 -----------
    loadAndProcessData().then(({ summaryData, countriesWithFeature }) => {
      setDataForMap(countriesWithFeature);
      setSummaryData(summaryData);
    });
    getCsvData("time_series_covid19_confirmed_global.csv").then((data) =>
      setCumulativeCasesData(data)
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
        <LeftColumn summaryData={summaryData} />
        <CenterColumn dataForMap={dataForMap} />
        <RightColumn
          summaryData={summaryData}
          cumulativeCasesData={cumulativeCasesData}
        />
      </Grid>
    </div>
  );
};

export default App;
