import { Flex, Grid, Heading } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { TDailyCountryD, TMainD } from "../types";
import { getDailyData, getTimeSeriesData } from "../utils/data";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

const Dashboard = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TMainD[] | null>(null);
  const [dailyData, setDailyData] = useState<TDailyCountryD[] | null>(null);
  const [selected, setSelected] = useState("");

  const handleLiClick = (countryName: string) => {
    setSelected((prev) => (prev === countryName ? "" : countryName));
  };

  const scrollList = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    if (selected) {
      const target = ref.current?.querySelector(
        `#${selected.replace(/\s+/g, "")}`
      );
      const parent = target?.parentElement;
      const parentID = parent?.id;
      const scrollHeight =
        parentID && parent?.scrollHeight
          ? (+parentID - 1) * parent.scrollHeight
          : 0;

      ref.current?.scrollTo({
        top: scrollHeight < 0 ? 0 : scrollHeight,
        behavior: "smooth",
      });
    } else {
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ----------- 데이터 로드 -----------
  useEffect(() => {
    getTimeSeriesData("time_series_covid19_confirmed_global.csv").then((data) =>
      setTimeSeriesData(data)
    );
    getDailyData("10-02-2020.csv").then((data) => setDailyData(data));
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
          dailyData={dailyData}
          selected={selected}
          handleLiClick={handleLiClick}
          scrollList={scrollList}
        />
        <CenterColumn
          dailyData={dailyData}
          selected={selected}
          setSelected={setSelected}
        />
        <RightColumn
          dailyData={dailyData}
          timeSeriesData={timeSeriesData}
          selected={selected}
          handleLiClick={handleLiClick}
          scrollList={scrollList}
        />
      </Grid>
    </div>
  );
};

export default Dashboard;
