import { Box, Grid, Select } from "@chakra-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TDailyD, TMainD } from "../types";
import LineChart from "./LineChart";
import RightColumnList from "./RightColumnList";

interface RightColumnProps {
  countryData: TDailyD[] | null;
  timeSeriesData: TMainD[] | null;
  selected: string;
  handleLiClick: (countryName: string) => void;
  scrollList: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
}

export type TTab = "active" | "deaths" | "recovered" | "new cases";

const RightColumn: React.FC<RightColumnProps> = ({
  countryData,
  timeSeriesData,
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

  const totalCount = useMemo(() => {
    let active = 0;
    let deaths = 0;
    let recovered = 0;
    let newCases = 0;
    if (countryData && timeSeriesData) {
      countryData?.forEach((d) => {
        active = active + (d.Active ?? 0);
        deaths = deaths + (d.Deaths ?? 0);
        recovered = recovered + (d.Recovered ?? 0);
      });
      timeSeriesData?.forEach((d) => {
        const { data } = d;
        const lastInx = data.length - 1;
        const currentCases = data[lastInx].count;
        const prevCases = data[lastInx - 1].count;
        const newCasesPerCountry =
          currentCases && prevCases ? currentCases - prevCases : null;
        newCases = newCases + (newCasesPerCountry ?? 0);
      });
      return { active, deaths, recovered, newCases };
    } else {
      return null;
    }
  }, [countryData, timeSeriesData]);

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

  const sortedData = useMemo(() => {
    if (countryData && timeSeriesData) {
      const date = countryData[0].Last_Update;
      const active = countryData
        .map((d) => ({ country: d.Country_Region, count: d.Active }))
        .sort((a, b) => compare(a.count, b.count));
      const deaths = countryData
        .map((d) => ({ country: d.Country_Region, count: d.Deaths }))
        .sort((a, b) => compare(a.count, b.count));
      const recovered = countryData
        .map((d) => ({ country: d.Country_Region, count: d.Recovered }))
        .sort((a, b) => compare(a.count, b.count));
      const newCases = timeSeriesData
        .map((d) => {
          const { CountryRegion, data } = d;
          const lastInx = data.length - 1;
          const currentCases = data[lastInx].count;
          const prevCases = data[lastInx - 1].count;
          const newCases =
            currentCases && prevCases ? currentCases - prevCases : null;
          return {
            country: CountryRegion,
            count: newCases,
            date: data[lastInx].date,
          };
        })
        .sort((a, b) => compare(a.count, b.count));
      return {
        active,
        deaths,
        recovered,
        date,
        newCases,
      };
    } else {
      return null;
    }
  }, [countryData, timeSeriesData]);

  const getLineChartData = () => {
    const countryD = timeSeriesData?.find((d) => d.CountryRegion === selected);
    if (countryD) {
      return countryD.data;
    } else {
      return null;
    }
  };

  const targetData = useMemo(() => {
    const targetData = countryData?.find((d) => d.Country_Region === selected);
    return targetData ?? null;
  }, [selected, countryData]);

  const lineChartData = getLineChartData();

  console.log("RightColumn Rendering...");
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
          <option value="active">Active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total Deaths</option>
          <option value="recovered">Total Recovered</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabL}
          totalCount={totalCount}
          targetData={targetData}
          sortedData={sortedData}
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
          <option value="active">Active</option>
          <option value="new cases">New Cases</option>
          <option value="deaths">Total Deaths</option>
          <option value="recovered">Total Recovered</option>
        </Select>
        <RightColumnList
          selected={selected}
          tab={tabR}
          totalCount={totalCount}
          targetData={targetData}
          sortedData={sortedData}
          listContainerRef={listContainerRefR}
          handleLiClick={handleLiClick}
        />
      </Grid>
      <Box ref={svgContainerRef} gridArea="graph" bg="red.500">
        {lineChartData && (
          <LineChart data={lineChartData} svgContainerRef={svgContainerRef} />
        )}
      </Box>
    </Grid>
  );
};

export default RightColumn;
