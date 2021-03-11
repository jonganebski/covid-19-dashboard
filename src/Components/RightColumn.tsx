import { Box, Flex, Grid, Heading, Select } from "@chakra-ui/react";
import React from "react";
import { useCountryDataCtx } from "../contexts/dataContext";
import {
  useSelectCountryCtx,
  useTabSelectionCtx,
} from "../contexts/selectContext";
import { DailyData, CountryAndCount, TTab } from "../types";
import { compare } from "../utils/utils";
import ChartContainer from "./ChartContainer";
import RightColumnList from "./RightColumnList";
import RightColumnListSelect from "./RightColumnSelect";
import Option from "./Option";

// ----------- SUB FUNCTIONS -----------

const getTabDataAndGlobalCount = (
  countryData: DailyData[] | null,
  tab: TTab
) => {
  const data: CountryAndCount[] = [];
  let globalCount = 0;
  countryData?.forEach((d) => {
    const country = d.country;
    const count =
      tab === "active"
        ? d.active
        : tab === "deaths"
        ? d.deaths
        : tab === "recovered"
        ? d.recovered
        : d.newCases;
    globalCount = globalCount + (count ?? 0);
    data.push({ country, count: count });
  });
  data.sort((a, b) => compare(a.count, b.count));
  return { data, globalCount };
};

// ----------- COMPONENT -----------

const RightColumn = () => {
  const { selectedCountry, handleLiClick } = useSelectCountryCtx();
  const { isLoading, data: countryData } = useCountryDataCtx();
  const {
    tabL,
    tabR,
    chartTab,
    setTabL,
    setTabR,
    setChartTab,
  } = useTabSelectionCtx();
  // For list on the left
  const { data: sortedDataL, globalCount: countL } = getTabDataAndGlobalCount(
    countryData,
    tabL
  );
  const targetDataL =
    sortedDataL.find((d) => d.country === selectedCountry) ?? null;

  // For list on the right
  const { data: sortedDataR, globalCount: countR } = getTabDataAndGlobalCount(
    countryData,
    tabR
  );
  const targetDataR =
    sortedDataR.find((d) => d.country === selectedCountry) ?? null;

  return (
    <Grid
      gridArea="right"
      gap={1}
      bg="black"
      style={{
        gridTemplate: `"Left Right" 3fr
                      "Left Right" 3fr
                      "Graph Graph" 4fr / 1fr 1fr`,
      }}
    >
      <Grid gridArea="Left" bg="black" gridTemplateRows="auto 2fr 6fr">
        <RightColumnListSelect setTab={setTabL} defaultValue="active" />
        <RightColumnList
          isLoading={isLoading}
          tab={tabL}
          globalCount={countL}
          targetData={targetDataL}
          sortedData={sortedDataL}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Grid gridArea="Right" bg="black" gridTemplateRows="auto 2fr 6fr">
        <RightColumnListSelect setTab={setTabR} defaultValue="new cases" />
        <RightColumnList
          isLoading={isLoading}
          tab={tabR}
          globalCount={countR}
          targetData={targetDataR}
          sortedData={sortedDataR}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Box gridArea="Graph" bg="gray.700">
        <Flex>
          <Select
            w="50%"
            size="sm"
            bg="black"
            color="white"
            defaultValue="daily cases"
            onChange={(e) => {
              if (
                e.currentTarget.value === "confirmed" ||
                e.currentTarget.value === "deaths" ||
                e.currentTarget.value === "daily cases" ||
                e.currentTarget.value === "daily deaths"
              ) {
                setChartTab(e.currentTarget.value);
              }
            }}
          >
            <Option value="confirmed" text="Confirmed (cumulative)" />
            <Option value="deaths" text="Deaths (cumulative)" />
            <Option value="daily cases" text="Daily Cases" />
            <Option value="daily deaths" text="Daily Deaths" />
          </Select>
          <Flex w="50%" justify="center">
            <Heading size="lg" color="white">
              {selectedCountry ? selectedCountry : "Global"}
            </Heading>
          </Flex>
        </Flex>
        <Box w="100%" h="100%" maxH="300px">
          <ChartContainer chartTab={chartTab} />
        </Box>
      </Box>
    </Grid>
  );
};

export default RightColumn;
