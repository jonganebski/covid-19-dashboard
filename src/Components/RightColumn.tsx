import { Box, Flex, Grid, Heading, Select } from "@chakra-ui/core";
import React, { useMemo, useRef, useState } from "react";
import { ITimeDataState, TDailyD, TListD } from "../types";
import LineChart from "./LineChart";
import RightColumnList from "./RightColumnList";

interface RightColumnProps {
  countryData: TDailyD[] | null;
  timeData: ITimeDataState;
  selected: string;
  handleLiClick: (countryName: string) => void;
}

const compare = (a: number | null, b: number | null) => {
  if (a && b) {
    return b - a;
  } else if (a && !b) {
    return -1;
  } else if (!a && b) {
    return 1;
  } else {
    return 0;
  }
};

export type TTab = "active" | "deaths" | "recovered" | "new cases";
export type TChartTab = "confirmed" | "deaths";

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

  const {
    activeData,
    deathsData,
    recoveredData,
    newCasesData,
    globalCount,
    dailyDataDate,
    timeDataDate,
  } = useMemo(() => {
    const activeData: TListD[] = [];
    const deathsData: TListD[] = [];
    const recoveredData: TListD[] = [];
    const newCasesData: TListD[] = [];
    const globalCount = { active: 0, deaths: 0, recovered: 0, newCases: 0 };
    let dailyDataDate = 0;
    let timeDataDate = 0;
    if (countryData) {
      dailyDataDate = new Date(countryData[0].lastUpdate).getTime();
      countryData.forEach((d) => {
        const country = d.country;
        const activeCount = d.active ?? null;
        const deathsCount = d.deaths ?? null;
        const recoveredCount = d.recovered ?? null;

        globalCount.active = globalCount.active + (d.active ?? 0);
        globalCount.deaths = globalCount.deaths + (d.deaths ?? 0);
        globalCount.recovered = globalCount.recovered + (d.recovered ?? 0);

        activeData.push({ country, count: activeCount });
        deathsData.push({ country, count: deathsCount });
        recoveredData.push({ country, count: recoveredCount });
      });
    }

    if (timeData.confirmed.countries) {
      timeData.confirmed.countries.forEach((d) => {
        const country = d.country;
        const lastIndex = d.data.length - 1;
        const count = d.data[lastIndex].count - d.data[lastIndex - 1].count;
        newCasesData.push({ country, count });
      });
    }
    if (timeData.confirmed.global) {
      const lastIndex = timeData.confirmed.global.length - 1;
      timeDataDate = timeData.confirmed.global[lastIndex].date;
      globalCount.newCases =
        timeData.confirmed.global[lastIndex].count -
        timeData.confirmed.global[lastIndex - 1].count;
    }
    return {
      activeData: activeData.sort((a, b) => compare(a.count, b.count)),
      deathsData: deathsData.sort((a, b) => compare(a.count, b.count)),
      recoveredData: recoveredData.sort((a, b) => compare(a.count, b.count)),
      newCasesData: newCasesData.sort((a, b) => compare(a.count, b.count)),
      globalCount,
      dailyDataDate,
      timeDataDate,
    };
  }, [countryData, timeData.confirmed.countries, timeData.confirmed.global]);

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

  const getTargetDataL = () => {
    if (!selected) {
      return null;
    }
    switch (tabL) {
      case "active": {
        return activeData.find((d) => d.country === selected) ?? null;
      }
      case "deaths": {
        return deathsData.find((d) => d.country === selected) ?? null;
      }
      case "recovered": {
        return recoveredData.find((d) => d.country === selected) ?? null;
      }
      case "new cases": {
        return newCasesData.find((d) => d.country === selected) ?? null;
      }
      default: {
        return null;
      }
    }
  };
  const getTargetDataR = () => {
    if (!selected) {
      return null;
    }
    switch (tabR) {
      case "active": {
        return activeData.find((d) => d.country === selected) ?? null;
      }
      case "deaths": {
        return deathsData.find((d) => d.country === selected) ?? null;
      }
      case "recovered": {
        return recoveredData.find((d) => d.country === selected) ?? null;
      }
      case "new cases": {
        return newCasesData.find((d) => d.country === selected) ?? null;
      }
      default: {
        return null;
      }
    }
  };

  let sortedDataL: TListD[] = [];
  let sortedDataR: TListD[] = [];
  let countL: number | null = null;
  let countR: number | null = null;
  let lastUpdateL = 0;
  let lastUpdateR = 0;
  switch (tabL) {
    case "active":
      sortedDataL = activeData;
      countL = globalCount.active;
      lastUpdateL = dailyDataDate;
      break;
    case "deaths":
      sortedDataL = deathsData;
      countL = globalCount.deaths;
      lastUpdateL = dailyDataDate;
      break;
    case "recovered":
      sortedDataL = recoveredData;
      countL = globalCount.recovered;
      lastUpdateL = dailyDataDate;
      break;
    case "new cases":
      sortedDataL = newCasesData;
      countL = globalCount.newCases;
      lastUpdateL = timeDataDate;
  }
  switch (tabR) {
    case "active":
      sortedDataR = activeData;
      countR = globalCount.active;
      lastUpdateR = dailyDataDate;
      break;
    case "deaths":
      sortedDataR = deathsData;
      countR = globalCount.deaths;
      lastUpdateR = dailyDataDate;
      break;
    case "recovered":
      sortedDataR = recoveredData;
      countR = globalCount.recovered;
      lastUpdateR = dailyDataDate;
      break;
    case "new cases":
      sortedDataR = newCasesData;
      countR = globalCount.newCases;
      lastUpdateR = timeDataDate;
  }
  return (
    <Grid
      gridArea="right"
      gap={1}
      bg="red.200"
      style={{
        gridTemplate: `"Left Right" 3fr
                      "Left Right" 3fr
                      "Graph Graph" 4fr / 1fr 1fr`,
      }}
    >
      <Grid gridArea="Left" bg="red.300" gridTemplateRows="1fr 5fr">
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
          <option value="active">Active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabL}
          globalCount={countL}
          lastUpdate={lastUpdateL}
          targetData={getTargetDataL()}
          sortedData={sortedDataL}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Grid gridArea="Right" bg="red.300" gridTemplateRows="1fr 5fr">
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
          <option value="active">Active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabR}
          globalCount={countR}
          lastUpdate={lastUpdateR}
          targetData={getTargetDataR()}
          sortedData={sortedDataR}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Box gridArea="Graph" bg="red.500">
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
            <option value="confirmed">Confirmed</option>
            <option value="deaths">Deaths</option>
          </Select>
          <Flex w="50%" justifyContent="center">
            <Heading size="lg">{selected ? selected : "Global"}</Heading>
          </Flex>
        </Flex>
        <Box ref={svgContainerRef} w="100%" h="100%" maxH="300px">
          <LineChart
            selected={selected}
            data={getLineChartData()}
            svgContainerRef={svgContainerRef}
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default RightColumn;
