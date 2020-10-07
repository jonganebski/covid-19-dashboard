import { Flex, Grid, Heading } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { getDailyData } from "../api/dailyData";
import { getTimeSeriesData } from "../api/timeData";
import { ITimeDataState, TDailyD } from "../types";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

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
      getDailyData("10-02-2020.csv"),
    ]).then(([confirmed, deaths, dailyData]) => {
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
      setCountryData(dailyData.countryWise);
      setProvinceData(dailyData.provinceWise);
    });
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
    </div>
  );
};

export default Dashboard;
