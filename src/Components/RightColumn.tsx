import {
  Grid,
  Flex,
  Heading,
  Box,
  List,
  ListItem,
  Divider,
  Text,
} from "@chakra-ui/core";
import React, { useRef } from "react";
import { IDateCount, TDailyD, TMainD } from "../App";
import LineChart from "./LineChart";

interface RightColumnProps {
  dailyData: {
    dailyCountryData: TDailyD[];
    dailyRegionData: TDailyD[];
  } | null;
  timeSeriesData: TMainD[] | null;
}

const RightColumn: React.FC<RightColumnProps> = ({
  dailyData,
  timeSeriesData,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  let totalDeaths = 0;
  let sortedCountryData: TDailyD[] = [];

  if (dailyData) {
    sortedCountryData = [...dailyData.dailyCountryData];
    sortedCountryData.sort((a, b) => b.Confirmed - a.Confirmed);
    sortedCountryData.forEach((d) => {
      totalDeaths = totalDeaths + d.Deaths;
    });
  }

  const newConfirmedData = timeSeriesData?.map((country) => {
    const { CountryRegion, data } = country;
    const lastInx = data.length - 1;
    const currnetConfirmed = data[lastInx].count;
    const prevConfirmed = data[lastInx - 1].count;
    const newConfirmed =
      currnetConfirmed && prevConfirmed ? currnetConfirmed - prevConfirmed : -1;
    return {
      CountryRegion,
      date: data[lastInx].date,
      newConfirmed,
    };
  });

  console.log("newConfirmed: ", newConfirmedData);

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
          <Heading size="md">Global Deaths</Heading>
          <Text fontSize="sm">(cumulative)</Text>
          <Heading size="xl" color="red.600">
            {totalDeaths.toLocaleString()}
          </Heading>
        </Flex>
        <Box overflowY="scroll">
          <List spacing={1}>
            {sortedCountryData.map((country, i) => (
              <ListItem key={i}>
                <Text fontWeight={600} color="gray.200">
                  {country.Deaths.toLocaleString()} deaths
                </Text>{" "}
                {country.Country_Region}
                <Divider />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
      <Grid gridArea="today" bg="red.300" gridTemplateRows="1fr 5fr" p={5}>
        <Flex mb={5} direction="column" align="center" justify="center">
          <Heading size="md">Global Cases</Heading>
          <Text fontSize="sm">(new cases)</Text>
          <Heading size="xl" color="red.600">
            {globalNewConfirmed?.toLocaleString()}
          </Heading>
        </Flex>
        <Box overflowY="scroll">
          <List spacing={1}>
            {newConfirmedData
              ?.sort((a, b) => b.newConfirmed - a.newConfirmed)
              .map((country, i) => (
                <ListItem key={i}>
                  <Text fontWeight={600} color="gray.200">
                    {country.newConfirmed.toLocaleString()} new cases
                  </Text>{" "}
                  {country.CountryRegion}
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
