import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import React, { useEffect, useMemo, useRef } from "react";
import { TDailyCountryD, TMainD } from "../types";
import LineChart from "./LineChart";

interface RightColumnProps {
  dailyData: TDailyCountryD[] | null;
  timeSeriesData: TMainD[] | null;
  selected: string;
  handleLiClick: (countryName: string) => void;
  scrollList: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
}

const RightColumn: React.FC<RightColumnProps> = ({
  dailyData,
  timeSeriesData,
  selected,
  handleLiClick,
  scrollList,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const deathsBoxRef = useRef<HTMLDivElement | null>(null);
  const newCasesBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollList(deathsBoxRef);
    scrollList(newCasesBoxRef);
  }, [selected, scrollList]);

  const totalDeaths = useMemo(() => {
    let count = 0;
    dailyData?.forEach((d) => {
      count = count + (d.Deaths ?? 0);
    });
    return count;
  }, [dailyData]);

  const newConfirmedData = useMemo(() => {
    return timeSeriesData?.map((country) => {
      const { CountryRegion, data } = country;
      const lastInx = data.length - 1;
      const currentConfirmed = data[lastInx].count;
      const prevConfirmed = data[lastInx - 1].count;
      const newConfirmed =
        currentConfirmed && prevConfirmed
          ? currentConfirmed - prevConfirmed
          : -1;
      return {
        CountryRegion,
        date: data[lastInx].date,
        newConfirmed,
      };
    });
  }, [timeSeriesData]);

  // console.log("newConfirmed: ", newConfirmedData);

  let globalNewConfirmed = 0;
  newConfirmedData?.forEach((d) => {
    globalNewConfirmed = globalNewConfirmed + d.newConfirmed;
  });

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
      <Grid gridArea="global" bg="red.300" gridTemplateRows="1fr 5fr" p={5}>
        <Flex mb={5} direction="column" align="center" justify="center">
          <Heading size="md">Total Deaths</Heading>
          <Heading size="lg">{selected ? selected : "Global"}</Heading>
          <Text fontSize="sm">(cumulative)</Text>
          <Heading size="xl" color="red.600">
            {selected === ""
              ? totalDeaths.toLocaleString()
              : dailyData
                  ?.filter((d) => d.Country_Region === selected)[0]
                  .Deaths?.toLocaleString() ?? "No data"}
          </Heading>
        </Flex>
        <Box overflowY="scroll" ref={deathsBoxRef}>
          <List spacing={1}>
            {dailyData
              ?.filter((d) => d.Deaths)
              .sort((a, b) => b.Deaths! - a.Deaths!)
              .map((d, i) => {
                const li = (
                  <ListItem
                    key={i}
                    id={i.toString()}
                    cursor="pointer"
                    onClick={() => handleLiClick(d.Country_Region)}
                    bg={selected === d.Country_Region ? "blue.300" : "none"}
                  >
                    <Text fontWeight={600} color="gray.200">
                      {d.Deaths
                        ? `${d.Deaths?.toLocaleString()} deaths`
                        : "No data"}
                    </Text>
                    <Text id={d.Country_Region.replace(/\s+/g, "")}>
                      {d.Country_Region}
                    </Text>
                    <Divider />
                  </ListItem>
                );
                return li;
              })}
          </List>
        </Box>
      </Grid>
      <Grid gridArea="today" bg="red.300" gridTemplateRows="1fr 5fr" p={5}>
        <Flex mb={5} direction="column" align="center" justify="center">
          <Heading size="md">New Cases</Heading>
          <Heading size="lg">{selected ? selected : "Global"}</Heading>
          <Text fontSize="sm">
            (
            {newConfirmedData
              ? new Date(newConfirmedData[0].date).toLocaleString()
              : "No data"}
            )
          </Text>
          <Heading size="xl" color="red.600">
            {selected
              ? newConfirmedData
                  ?.filter((d) => d.CountryRegion === selected)[0]
                  .newConfirmed.toLocaleString()
              : globalNewConfirmed?.toLocaleString()}
          </Heading>
        </Flex>
        <Box overflowY="scroll" ref={newCasesBoxRef}>
          <List spacing={1}>
            {newConfirmedData
              ?.sort((a, b) => b.newConfirmed - a.newConfirmed)
              .map((country, i) => (
                <ListItem
                  key={i}
                  id={i.toString()}
                  cursor="pointer"
                  onClick={() => handleLiClick(country.CountryRegion)}
                  bg={selected === country.CountryRegion ? "blue.300" : "none"}
                >
                  <Text fontWeight={600} color="gray.200">
                    {country.newConfirmed.toLocaleString()} new cases
                  </Text>
                  <Text id={country.CountryRegion.replace(/\s+/g, "")}>
                    {country.CountryRegion}
                  </Text>
                  <Divider />
                </ListItem>
              ))}
          </List>
        </Box>
      </Grid>
      <Box ref={svgContainerRef} gridArea="graph" bg="red.500">
        {timeSeriesData && (
          <LineChart
            data={timeSeriesData[0].data}
            svgContainerRef={svgContainerRef}
          />
        )}
      </Box>
    </Grid>
  );
};

export default RightColumn;
