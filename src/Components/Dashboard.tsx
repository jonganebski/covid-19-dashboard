import { Flex, Grid, Heading } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { getDailyData } from "../api/dailyData";
import { getTimeSeriesData } from "../api/timeData";
import { ITimeDataState, TDailyD } from "../types";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

// -----------  COMPONENT  -----------

const Dashboard = () => {
  const [timeData, setTimeData] = useState<ITimeDataState>({
    confirmed: { countries: null, global: null },
    deaths: { countries: null, global: null },
    recovered: { countries: null, global: null },
  });
  const [countryData, setCountryData] = useState<TDailyD[] | null>(null);
  const [provinceData, setProvinceData] = useState<TDailyD[] | null>(null);
  const [selected, setSelected] = useState("");

  const handleLiClick = (countryName: string) => {
    setSelected((prev) => (prev === countryName ? "" : countryName));
  };
  // ----------- 데이터 로드 -----------

  useEffect(() => {
    Promise.all([
      getTimeSeriesData("time_series_covid19_confirmed_global.csv"),
      getTimeSeriesData("time_series_covid19_deaths_global.csv"),
      getDailyData("10-07-2020.csv"),
      getDailyData("10-06-2020.csv"),
      getDailyData("10-05-2020.csv"),
      // getTimeSeriesData(
      //   "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
      // ),
      // getTimeSeriesData(
      //   "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
      // ),
      // getDailyData(
      //   "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/10-07-2020.csv"
      // ),
    ]).then(
      ([confirmed, deaths, todayData, yesterdayData, twoDaysBeforeData]) => {
        setTimeData({
          confirmed: {
            countries: confirmed.countryData,
            global: confirmed.globalData,
          },
          deaths: {
            countries: deaths.countryData,
            global: deaths.globalData,
          },
          recovered: {
            countries: null,
            global: null,
          },
        });
        todayData.countryWise.forEach((D) => {
          const country = D.country;
          const yesterdayConfirmed = yesterdayData.countryWise.find(
            (d) => d.country === country
          )?.confirmed;
          const twoDaysBeforeConfirmed = twoDaysBeforeData.countryWise.find(
            (d) => d.country === country
          )?.confirmed;
          if (yesterdayConfirmed && twoDaysBeforeConfirmed) {
            D.newCases = yesterdayConfirmed - twoDaysBeforeConfirmed;
          }
        });

        todayData.provinceWise.forEach((D) => {
          const key = D.combinedKey;
          const yesterday = yesterdayData.provinceWise.find(
            (d) => d.combinedKey === key
          );
          const yesterdayConfirmed = yesterday?.confirmed;
          const yesterdayDate = yesterday?.lastUpdate;
          const twoDaysBeforeConfirmed = twoDaysBeforeData.provinceWise.find(
            (d) => d.combinedKey === key
          )?.confirmed;

          if (yesterdayConfirmed && twoDaysBeforeConfirmed) {
            D.newCases = yesterdayConfirmed - twoDaysBeforeConfirmed;
          }
          D.newCasesLastUpdate = yesterdayDate ?? "";
        });
        setCountryData(todayData.countryWise);
        setProvinceData(todayData.provinceWise);
      }
    );
  }, []);

  return (
    <Flex className="App" p={1} w="100vw" h="100vh" bg="black">
      <Grid
        w="100%"
        gap={1}
        style={{
          gridTemplate: `"header header header" 5vh
                          "left center right" 94vh / 3fr 9fr 5fr`,
        }}
      >
        <Flex gridArea="header" justify="center" bg="gray.800" color="gray.400">
          <Heading> Covid-19 Information Dashboard</Heading>
        </Flex>
        <LeftColumn
          countryData={countryData}
          selected={selected}
          handleLiClick={handleLiClick}
        />
        <CenterColumn
          countryData={countryData}
          provinceData={provinceData}
          selected={selected}
          setSelected={setSelected}
        />
        <RightColumn
          countryData={countryData}
          timeData={timeData}
          selected={selected}
          handleLiClick={handleLiClick}
        />
      </Grid>
    </Flex>
  );
};

export default Dashboard;
