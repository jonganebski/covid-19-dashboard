import { Flex, Grid, Heading } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { TDailyD, TDateCount, TTimeseriesD } from "../types";
import { getDailyData } from "../api/dailyData";
import { getTimeSeriesData } from "../api/timeData";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

interface TTimeDataState {
  confirmed: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
  deaths: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
  recovered: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
}

const Dashboard = () => {
  const [timeData, setTimeData] = useState<TTimeDataState>({
    confirmed: { countries: null, global: null },
    deaths: { countries: null, global: null },
    recovered: { countries: null, global: null },
  });
  const [countryData, setCountryData] = useState<TDailyD[] | null>(null);
  const [provinceData, setProvinceData] = useState<TDailyD[] | null>(null);
  const [selected, setSelected] = useState("");
  console.log(timeData);
  // console.log("selected: ", selected);

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
    Promise.all([
      getTimeSeriesData("time_series_covid19_confirmed_global.csv"),
      getTimeSeriesData("time_series_covid19_deaths_global.csv"),
    ]).then(([confirmed, deaths]) => {
      setTimeData({
        confirmed: {
          countries: confirmed.countryTimeData,
          global: confirmed.globalTimeData,
        },
        deaths: {
          countries: deaths.countryTimeData,
          global: deaths.globalTimeData,
        },
        recovered: {
          countries: null,
          global: null,
        },
      });
    });

    // getDailyData("10-02-2020.csv").then(({ countryWise, provinceWise }) => {
    //   setCountryData(countryWise);
    //   setProvinceData(provinceWise);
    // });
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
      {/* <Grid
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
          scrollList={scrollList}
        />
        <CenterColumn
          countryData={countryData}
          provinceData={provinceData}
          selected={selected}
          setSelected={setSelected}
        />
        <RightColumn
          countryData={countryData}
          timeSeriesData={timeSeriesData}
          selected={selected}
          handleLiClick={handleLiClick}
          scrollList={scrollList}
        />
      </Grid> */}
    </div>
  );
};

export default Dashboard;
