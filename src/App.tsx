import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import LineChart from "./Components/LineChart";
import MapWithCircles from "./Components/MapWithCircles";
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import styled from "styled-components";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/core";

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

type TdataGlobalNow = {
  date: string;
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
};

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

// const getCsvData = async (fileName: string) => {
//   const loadedData = await d3.csv(fileName);
//   const selectedData = loadedData.filter(
//     (d) => d["Country/Region"] === "Japan"
//   );
//   const filteredData = Object.entries(selectedData[0]).filter(([key, _]) => {
//     const date = new Date(key);
//     if (isNaN(date.getTime())) {
//       return false;
//     } else {
//       return true;
//     }
//   });
//   const data = filteredData.map((d) => {
//     const date = new Date(d[0]);
//     return {
//       date: date.getTime(),
//       count: d[1] ? +d[1] : 0,
//     };
//   });
//   return data;
// };

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
    console.log("geojsonData: ", geojsonData);
    console.log("summaryData: ", summaryData);

    const countriesObj = summaryData.Countries.reduce(
      (acc: { [key: string]: any }, countryD: any) => {
        const countryCode = countryD.CountryCode;
        acc[countryCode] = countryD;
        return acc;
      },
      {}
    );
    console.log("countriesObj: ", countriesObj);
    const countriesWithFeature = geojsonData.features.map((feature) => {
      const countryCode = feature.properties!.iso_a2;
      return { countryCode, feature, data: countriesObj[countryCode] };
    });
    console.log("countriesWithFeature: ", countriesWithFeature);

    return { summaryData, countriesWithFeature };
  });
};

const App = () => {
  // const [cumulativeCasesData, setCumulativeCasesData] = useState<Array<
  //   IDateCount
  // > | null>(null);
  // const [cumulativeDeathsData, setCumulativeDeathsData] = useState<Array<
  //   IDateCount
  // > | null>(null);
  // const [cumulativeRecoveredData, setCumulativeRecoveredData] = useState<Array<
  //   IDateCount
  // > | null>(null);
  // const [testData, setTestData] = useState<Array<IDateCount> | null>(null);
  const [dataForMap, setDataForMap] = useState<TdataForMap | null>(null);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  // useEffect(() => {
  // getCsvData("time_series_covid19_confirmed_global.csv").then((data) =>
  //   setCumulativeCasesData(data)
  // );
  // getCsvData("time_series_covid19_deaths_global.csv").then((data) =>
  //   setCumulativeDeathsData(data)
  // );
  // getCsvData("time_series_covid19_recovered_global.csv").then((data) =>
  //   setCumulativeRecoveredData(data)
  // );
  // getApiData().then((data) => setTestData(data));
  // }, []);
  useEffect(() => {
    // ----------- 데이터 로드 -----------
    loadAndProcessData().then(({ summaryData, countriesWithFeature }) => {
      setDataForMap(countriesWithFeature);
      setSummaryData(summaryData);
    });
  }, []);

  return (
    <>
      <div
        className="App"
        style={{
          padding: "5px",
          width: "100vw",
          height: "100vh",
          display: "flex",
        }}
      >
        {/* {cumulativeCasesData && <LineChart data={cumulativeCasesData} />}
      {cumulativeDeathsData && <LineChart data={cumulativeDeathsData} />}
      {cumulativeRecoveredData && <LineChart data={cumulativeRecoveredData} />}
      {testData && <LineChart data={testData} />} */}

        <Grid
          w="100%"
          gap={1}
          style={{
            gridTemplate: `"header header header" 5vh
                          "left center right" 94vh / 3fr 9fr 5fr`,
          }}
        >
          <Box gridArea="header" bg="blue.500"></Box>
          <Grid
            gridArea="left"
            bg="blue.200"
            gridTemplateRows="2fr 12fr 1.5fr"
            gap={1}
          >
            <Flex direction="column" align="center" justify="center">
              <Heading size="md">Global Cases</Heading>
              <Text fontSize="sm">(cumulative)</Text>
              <Heading size="xl" color="red.600">
                {summaryData?.Global.TotalConfirmed.toLocaleString()}
              </Heading>
            </Flex>
            <Box bg="blue.400" overflowY="scroll" p={5}>
              <List spacing={1}>
                {summaryData?.Countries.sort(
                  (a: any, b: any) => b.TotalConfirmed - a.TotalConfirmed
                ).map((country: any) => (
                  <ListItem>
                    <Text fontWeight={600} color="red.600" display="inline">
                      {country.TotalConfirmed.toLocaleString()}
                    </Text>{" "}
                    {country.Country}
                    <Divider />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="blue.500"
            >
              <Text>Last Updated at</Text>
              <Text fontSize="2xl" fontWeight={500}>
                {new Date(summaryData?.Date).toLocaleString()}
              </Text>
            </Flex>
          </Grid>
          <Grid gridArea="center" gridTemplateRows="7fr 1fr" gap={1}>
            <Stack bg="green.300">
              {dataForMap && <MapWithCircles data={dataForMap} />}
            </Stack>
            <Box bg="green.700"></Box>
          </Grid>
          <Grid
            gridArea="right"
            gap={1}
            bg="red.200"
            style={{
              gridTemplate: `"global today" 3fr
                            "global today" 3fr
                            "graph graph" 4fr / 1fr 1fr`,
            }}
          >
            <Grid
              gridArea="global"
              bg="red.300"
              gridTemplateRows="1fr 5fr"
              p={5}
            >
              <Flex mb={5} direction="column" align="center" justify="center">
                <Heading size="md">Global Deaths</Heading>
                <Text fontSize="sm">(cumulative)</Text>
                <Heading size="xl" color="red.600">
                  {summaryData?.Global.TotalDeaths.toLocaleString()}
                </Heading>
              </Flex>
              <Box overflowY="scroll">
                <List spacing={1}>
                  {summaryData?.Countries.sort(
                    (a: any, b: any) => b.TotalDeaths - a.TotalDeaths
                  ).map((country: any) => (
                    <ListItem>
                      <Text fontWeight={600} color="gray.200">
                        {country.TotalDeaths.toLocaleString()} deaths
                      </Text>{" "}
                      {country.Country}
                      <Divider />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid
              gridArea="today"
              bg="red.300"
              gridTemplateRows="1fr 5fr"
              p={5}
            >
              <Flex mb={5} direction="column" align="center" justify="center">
                <Heading size="md">Global Cases</Heading>
                <Text fontSize="sm">(new cases)</Text>
                <Heading size="xl" color="red.600">
                  {summaryData?.Global.NewConfirmed.toLocaleString()}
                </Heading>
              </Flex>
              <Box overflowY="scroll">
                <List spacing={1}>
                  {summaryData?.Countries.sort(
                    (a: any, b: any) => b.NewConfirmed - a.NewConfirmed
                  ).map((country: any) => (
                    <ListItem>
                      <Text fontWeight={600} color="gray.200">
                        {country.NewConfirmed.toLocaleString()} new cases
                      </Text>{" "}
                      {country.Country}
                      <Divider />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Box gridArea="graph" bg="red.500"></Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default App;
