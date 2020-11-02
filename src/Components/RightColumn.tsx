import { Box, Flex, Grid, Heading, Select } from "@chakra-ui/core";
import React, { useRef, useState } from "react";
import {
  ITimeDataState,
  TChartTab,
  TDailyD,
  TDateCount,
  TListD,
  TTab,
} from "../types";
import { compare } from "../utils/utils";
import LineChart from "./LineChart";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";
import RightColumnList from "./RightColumnList";
import RightColumnListSelect from "./RightColumnSelect";

interface RightColumnProps {
  countryData: TDailyD[] | null;
  timeData: ITimeDataState;
  isCsvLoading: boolean;
  selected: string;
  handleLiClick: (countryName: string) => void;
}

// ----------- SUB FUNCTIONS -----------

const getTabDataAndGlobalCount = (countryData: TDailyD[] | null, tab: TTab) => {
  const data: TListD[] = [];
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

const getLineChartData = (
  selected: string,
  chartTab: TChartTab,
  timeData: ITimeDataState
): TDateCount[] | null => {
  if (chartTab === "confirmed" || chartTab === "deaths") {
    if (!selected) {
      return timeData[chartTab].global ?? null;
    } else {
      return (
        timeData[chartTab].countries?.find((d) => d.country === selected)
          ?.data ?? null
      );
    }
  } else {
    return null;
  }
};

const getBarChartData = (
  selected: string,
  chartTab: TChartTab,
  timeData: ITimeDataState
): TDateCount[] | null => {
  const barChartData: ITimeDataState = { ...timeData };
  const returnData: TDateCount[] = [];
  if (chartTab === "daily cases") {
    if (!selected) {
      const targetData = barChartData.confirmed.global;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    } else {
      const targetData = barChartData.confirmed.countries?.find(
        (d) => d.country === selected
      )?.data;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    }
  } else if (chartTab === "daily deaths") {
    if (!selected) {
      const targetData = barChartData.deaths.global;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    } else {
      const targetData = barChartData.deaths.countries?.find(
        (d) => d.country === selected
      )?.data;
      if (targetData) {
        returnData.push(targetData[0]);
        targetData.reduce((acc, d) => {
          returnData.push({ date: d.date, count: d.count - acc.count });
          return d;
        });
        return returnData;
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};

// ----------- COMPONENT -----------

const RightColumn: React.FC<RightColumnProps> = ({
  countryData,
  timeData,
  isCsvLoading,
  selected,
  handleLiClick,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const [tabL, setTabL] = useState<TTab>("active");
  const [tabR, setTabR] = useState<TTab>("new cases");
  const [chartTab, setChartTab] = useState<TChartTab>("daily cases");

  // For list on the left
  const sortedDataL = getTabDataAndGlobalCount(countryData, tabL).data;
  const targetDataL = sortedDataL.find((d) => d.country === selected) ?? null;
  const countL = getTabDataAndGlobalCount(countryData, tabL).globalCount;

  // For list on the right
  const sortedDataR = getTabDataAndGlobalCount(countryData, tabR).data;
  const targetDataR = sortedDataR.find((d) => d.country === selected) ?? null;
  const countR = getTabDataAndGlobalCount(countryData, tabR).globalCount;

  // For chart on the bottom
  const lineChartData = getLineChartData(selected, chartTab, timeData);
  const barChartData = getBarChartData(selected, chartTab, timeData);
  console.log("barChartData: ", barChartData);

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
        <RightColumnListSelect
          countryData={countryData}
          setTab={setTabL}
          defaultValue="active"
        />
        <RightColumnList
          selected={selected}
          tab={tabL}
          globalCount={countL}
          targetData={targetDataL}
          sortedData={sortedDataL}
          isCsvLoading={isCsvLoading}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Grid gridArea="Right" bg="black" gridTemplateRows="auto 2fr 6fr">
        <RightColumnListSelect
          countryData={countryData}
          setTab={setTabR}
          defaultValue="new cases"
        />
        <RightColumnList
          selected={selected}
          tab={tabR}
          globalCount={countR}
          targetData={targetDataR}
          sortedData={sortedDataR}
          isCsvLoading={isCsvLoading}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Box gridArea="Graph" bg="gray.700">
        <Flex>
          <Select
            w="50%"
            size="sm"
            backgroundColor="black"
            color="white"
            placeholder="Select option"
            // defaultValue="confirmed"
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
            <option value="confirmed">Confirmed (cumulative)</option>
            <option value="deaths">Deaths (cumulative)</option>
            <option value="daily cases">Daily Cases</option>
            <option value="daily deaths">Daily Deaths</option>
          </Select>
          <Flex w="50%" justify="center">
            <Heading size="lg" color="white">
              {selected ? selected : "Global"}
            </Heading>
          </Flex>
        </Flex>
        <Box ref={svgContainerRef} w="100%" h="100%" maxH="300px">
          {isCsvLoading ? (
            <Loading />
          ) : barChartData ? (
            <LineChart
              selected={selected}
              // data={lineChartData}
              data={barChartData}
              svgContainerRef={svgContainerRef}
            />
          ) : (
            <LoadingFailed />
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default RightColumn;
