import { Flex, Grid } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import csvApi from "../api/csvData";
import { newsApi } from "../api/newsApi";
import { ITimeDataState, TDailyD, TNewsData } from "../types";
import CenterColumn from "./CenterColumn";
import Header from "./Header";
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
  const [newsData, setNewsData] = useState<TNewsData[] | null>(null);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [selected, setSelected] = useState("");

  // console.log("Dashboard Rendering");
  // console.log("timeData", timeData);
  // console.log("countryData", countryData);
  // console.log("provinceData", provinceData);
  // console.log("Dashboard newsData: ", newsData);

  const handleLiClick = (countryName: string) => {
    setSelected((prev) => (prev === countryName ? "" : countryName));
  };

  // Gets csv data
  useEffect(() => {
    setIsCsvLoading(true);
    csvApi()
      .then((results) => {
        const { confirmed, deaths, todayData } = results;
        setCountryData(todayData.countryWise);
        setProvinceData(todayData.provinceWise);
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
      })
      .finally(() => setIsCsvLoading(false));
  }, []);

  // Gets news data
  useEffect(() => {
    setIsNewsLoading(true);
    newsApi(selected)
      .then((result) => setNewsData(result))
      .finally(() => setIsNewsLoading(false));
  }, [selected]);

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
        <Header />
        <LeftColumn
          countryData={countryData}
          isCsvLoading={isCsvLoading}
          selected={selected}
          handleLiClick={handleLiClick}
        />
        <CenterColumn
          countryData={countryData}
          provinceData={provinceData}
          newsData={newsData}
          isNewsLoading={isNewsLoading}
          isCsvLoading={isCsvLoading}
          selected={selected}
          setSelected={setSelected}
        />
        <RightColumn
          countryData={countryData}
          timeData={timeData}
          isCsvLoading={isCsvLoading}
          selected={selected}
          handleLiClick={handleLiClick}
        />
      </Grid>
    </Flex>
  );
};

export default Dashboard;
