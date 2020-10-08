import { Box, Flex, Grid, Heading, Select } from "@chakra-ui/core";
import React, { useRef, useState } from "react";
import { ITimeDataState, TDailyD, TListD } from "../types";
import { compare } from "../utils/utils";
import LineChart from "./LineChart";
import Loading from "./Loading";
import RightColumnList from "./RightColumnList";

interface RightColumnProps {
  countryData: TDailyD[] | null;
  timeData: ITimeDataState;
  selected: string;
  handleLiClick: (countryName: string) => void;
}

export type TTab = "active" | "deaths" | "recovered" | "new cases";
export type TChartTab = "confirmed" | "deaths";

// ----------- COMPONENT -----------

const RightColumn: React.FC<RightColumnProps> = ({
  countryData,
  timeData,
  selected,
  handleLiClick,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const [tabL, setTabL] = useState<TTab>("active");
  const [tabR, setTabR] = useState<TTab>("new cases");
  const [chartTab, setChartTab] = useState<TChartTab>("confirmed");

  const activeData: TListD[] = [];
  const deathsData: TListD[] = [];
  const recoveredData: TListD[] = [];
  const newCasesData: TListD[] = [];
  const globalCount = { active: 0, deaths: 0, recovered: 0, newCases: 0 };

  if (countryData) {
    countryData.forEach((d) => {
      const country = d.country;
      const activeCount = d.active;
      const deathsCount = d.deaths;
      const recoveredCount = d.recovered;
      const newCasesCount = d.newCases;

      globalCount.active = globalCount.active + (activeCount ?? 0);
      globalCount.deaths = globalCount.deaths + (deathsCount ?? 0);
      globalCount.recovered = globalCount.recovered + (recoveredCount ?? 0);
      globalCount.newCases = globalCount.newCases + (newCasesCount ?? 0);

      activeData.push({ country, count: activeCount });
      deathsData.push({ country, count: deathsCount });
      recoveredData.push({ country, count: recoveredCount });
      newCasesData.push({ country, count: newCasesCount });
    });
  }

  const getLineChartData = () => {
    if (selected) {
      let countryD;
      if (chartTab === "confirmed") {
        countryD = timeData?.confirmed.countries?.find(
          (d) => d.country === selected
        );
      } else {
        countryD = timeData?.deaths.countries?.find(
          (d) => d.country === selected
        );
      }
      if (countryD) {
        return countryD.data;
      } else {
        return null;
      }
    } else {
      let globalD;
      if (chartTab === "confirmed") {
        globalD = timeData.confirmed.global;
      } else {
        globalD = timeData.deaths.global;
      }
      if (globalD) {
        return globalD;
      } else {
        return null;
      }
    }
  };

  let sortedDataL: TListD[] = [];
  let targetDataL: TListD | null = null;
  let countL: number | null = null;

  switch (tabL) {
    case "active":
      sortedDataL = activeData.sort((a, b) => compare(a.count, b.count));
      targetDataL = activeData.find((d) => d.country === selected) ?? null;
      countL = globalCount.active;
      break;
    case "deaths":
      sortedDataL = deathsData.sort((a, b) => compare(a.count, b.count));
      targetDataL = deathsData.find((d) => d.country === selected) ?? null;
      countL = globalCount.deaths;
      break;
    case "recovered":
      sortedDataL = recoveredData.sort((a, b) => compare(a.count, b.count));
      targetDataL = recoveredData.find((d) => d.country === selected) ?? null;
      countL = globalCount.recovered;
      break;
    case "new cases":
      sortedDataL = newCasesData.sort((a, b) => compare(a.count, b.count));
      targetDataL = newCasesData.find((d) => d.country === selected) ?? null;
      countL = globalCount.newCases;
  }

  let sortedDataR: TListD[] = [];
  let targetDataR: TListD | null = null;
  let countR: number | null = null;

  switch (tabR) {
    case "active":
      sortedDataR = activeData.sort((a, b) => compare(a.count, b.count));
      targetDataR = activeData.find((d) => d.country === selected) ?? null;
      countR = globalCount.active;
      break;
    case "deaths":
      sortedDataR = deathsData.sort((a, b) => compare(a.count, b.count));
      targetDataR = deathsData.find((d) => d.country === selected) ?? null;
      countR = globalCount.deaths;
      break;
    case "recovered":
      sortedDataR = recoveredData.sort((a, b) => compare(a.count, b.count));
      targetDataR = recoveredData.find((d) => d.country === selected) ?? null;
      countR = globalCount.recovered;
      break;
    case "new cases":
      sortedDataR = newCasesData.sort((a, b) => compare(a.count, b.count));
      targetDataR = newCasesData.find((d) => d.country === selected) ?? null;
      countR = globalCount.newCases;
  }
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
        <Select
          size="sm"
          backgroundColor="black"
          color="white"
          placeholder="Select option"
          defaultValue="active"
          onChange={(e) => {
            if (
              e.currentTarget.value === "active" ||
              e.currentTarget.value === "deaths" ||
              e.currentTarget.value === "recovered" ||
              e.currentTarget.value === "new cases"
            ) {
              setTabL(e.currentTarget.value);
            }
          }}
        >
          <option value="active">
            Active ({countryData && countryData[0].lastUpdate})
          </option>
          <option value="new cases">
            New Cases ({countryData && countryData[0].newCasesLastUpdate})
          </option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabL}
          globalCount={countL}
          targetData={targetDataL}
          sortedData={sortedDataL}
          countryData={countryData}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Grid gridArea="Right" bg="black" gridTemplateRows="auto 2fr 6fr">
        <Select
          size="sm"
          backgroundColor="black"
          color="white"
          placeholder="Select option"
          defaultValue="new cases"
          onChange={(e) => {
            if (
              e.currentTarget.value === "active" ||
              e.currentTarget.value === "deaths" ||
              e.currentTarget.value === "recovered" ||
              e.currentTarget.value === "new cases"
            ) {
              setTabR(e.currentTarget.value);
            }
          }}
        >
          <option value="active">
            Active ({countryData && countryData[0].lastUpdate})
          </option>
          <option value="new cases">
            New Cases ({countryData && countryData[0].newCasesLastUpdate})
          </option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabR}
          globalCount={countR}
          targetData={targetDataR}
          sortedData={sortedDataR}
          countryData={countryData}
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
            defaultValue="confirmed"
            onChange={(e) => {
              if (
                e.currentTarget.value === "confirmed" ||
                e.currentTarget.value === "deaths"
              ) {
                setChartTab(e.currentTarget.value);
              }
            }}
          >
            <option value="confirmed">Confirmed (cumulative)</option>
            <option value="deaths">Deaths (cumulative)</option>
          </Select>
          <Flex w="50%" justifyContent="center">
            <Heading size="lg" color="white">
              {selected ? selected : "Global"}
            </Heading>
          </Flex>
        </Flex>
        <Box ref={svgContainerRef} w="100%" h="100%" maxH="300px">
          {!getLineChartData() ? (
            <Loading />
          ) : (
            <LineChart
              selected={selected}
              data={getLineChartData()}
              svgContainerRef={svgContainerRef}
            />
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default RightColumn;
