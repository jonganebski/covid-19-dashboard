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
import React from "react";
import { TDailyD } from "../App";

interface LeftColumnProps {
  dailyData: {
    countryWise: TDailyD[];
    provinceWise: TDailyD[];
  } | null;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ dailyData }) => {
  let totalConfirmed = 0;
  dailyData?.countryWise.forEach((d) => {
    totalConfirmed = totalConfirmed + d.Confirmed;
  });

  return (
    <Grid
      gridArea="left"
      bg="blue.200"
      gridTemplateRows="2fr 12fr 1.5fr"
      gap={1}
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="md">Global Cases</Heading>
        <Text fontSize="sm">(cumulative)</Text>
        <Heading size="xl" color="red.600">
          {totalConfirmed.toLocaleString()}
        </Heading>
      </Flex>
      <Box bg="blue.400" overflowY="scroll" p={5}>
        <List spacing={1}>
          {dailyData?.countryWise
            .sort((a, b) => b.Confirmed - a.Confirmed)
            .map((d, i) => (
              <ListItem key={i}>
                <Text fontWeight={600} color="red.600" display="inline">
                  {d.Confirmed.toLocaleString()}
                </Text>{" "}
                {d.Country_Region}
                <Divider />
              </ListItem>
            ))}
        </List>
      </Box>
      <Flex direction="column" align="center" justify="center" bg="blue.500">
        <Text>Last Updated at</Text>
        <Text fontSize="2xl" fontWeight={500}>
          {dailyData &&
            new Date(dailyData.countryWise[0].Last_Update).toLocaleString()}
        </Text>
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
