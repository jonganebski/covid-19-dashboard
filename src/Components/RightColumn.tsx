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
import { IDateCount } from "../App";
import LineChart from "./LineChart";

interface RightColumnProps {
  summaryData: any;
  cumulativeCasesData: Array<IDateCount> | null;
}

const RightColumn: React.FC<RightColumnProps> = ({
  summaryData,
  cumulativeCasesData,
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
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
            {summaryData?.Global.TotalDeaths.toLocaleString()}
          </Heading>
        </Flex>
        <Box overflowY="scroll">
          <List spacing={1}>
            {summaryData?.Countries.sort(
              (a: any, b: any) => b.TotalDeaths - a.TotalDeaths
            ).map((country: any) => (
              <ListItem>
                <Text fontWeight={600} color="gray.200">
                  {country.TotalDeaths.toLocaleString()} deaths
                </Text>{" "}
                {country.Country}
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
            {summaryData?.Global.NewConfirmed.toLocaleString()}
          </Heading>
        </Flex>
        <Box overflowY="scroll">
          <List spacing={1}>
            {summaryData?.Countries.sort(
              (a: any, b: any) => b.NewConfirmed - a.NewConfirmed
            ).map((country: any) => (
              <ListItem>
                <Text fontWeight={600} color="gray.200">
                  {country.NewConfirmed.toLocaleString()} new cases
                </Text>{" "}
                {country.Country}
                <Divider />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
      <Box ref={svgContainerRef} gridArea="graph" bg="red.500">
        {cumulativeCasesData && (
          <LineChart
            data={cumulativeCasesData}
            svgContainerRef={svgContainerRef}
          />
        )}
      </Box>
    </Grid>
  );
};

export default RightColumn;
