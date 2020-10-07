import { Box, Grid, Select } from "@chakra-ui/core";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ITimeDataState, TDailyD, TListD, TTimeseriesD } from "../types";
import LineChart from "./LineChart";
import RightColumnList from "./RightColumnList";

interface RightColumnProps {
  countryData: TDailyD[] | null;
  timeData: ITimeDataState;
  selected: string;
  handleLiClick: (countryName: string) => void;
  scrollList: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
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

const RightColumn: React.FC<RightColumnProps> = ({
  countryData,
  timeData,
  selected,
  handleLiClick,
  scrollList,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const listContainerRefL = useRef<HTMLDivElement | null>(null);
  const listContainerRefR = useRef<HTMLDivElement | null>(null);
  const [tabL, setTabL] = useState<TTab>("active");
  const [tabR, setTabR] = useState<TTab>("new cases");

  useEffect(() => {
    scrollList(listContainerRefL);
    scrollList(listContainerRefR);
  }, [selected, scrollList]);

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
      const countryD = timeData?.confirmed.countries?.find(
        (d) => d.country === selected
      );
      if (countryD) {
        console.log(countryD);
        return countryD.data;
      } else {
        console.log("no countryD");
        return null;
      }
    } else {
      const globalD = timeData.confirmed.global;
      if (globalD) {
        return globalD;
      } else {
        return null;
      }
    }
  };

  // const targetData = useMemo(() => {
  //   const targetData = countryData?.find((d) => d.country === selected);
  //   return targetData ?? null;
  // }, [selected, countryData]);

  console.log("RightColumn Rendering...");
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
        gridTemplate: `"global today" 3fr
                    "global today" 3fr
                    "graph graph" 4fr / 1fr 1fr`,
      }}
    >
      <Grid gridArea="global" bg="red.300" gridTemplateRows="1fr 5fr">
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
          <option value="active">active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabL}
          globalCount={countL}
          lastUpdate={lastUpdateL}
          sortedData={sortedDataL}
          listContainerRef={listContainerRefL}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Grid gridArea="today" bg="red.300" gridTemplateRows="1fr 5fr">
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
          <option value="active">active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total deaths (cumulative)</option>
          <option value="recovered">Total recovered (cumulative)</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabR}
          globalCount={countR}
          lastUpdate={lastUpdateR}
          sortedData={sortedDataR}
          listContainerRef={listContainerRefR}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Box ref={svgContainerRef} gridArea="graph" bg="red.500">
        <LineChart
          data={getLineChartData()}
          svgContainerRef={svgContainerRef}
        />
      </Box>
    </Grid>
  );
};

export default RightColumn;
