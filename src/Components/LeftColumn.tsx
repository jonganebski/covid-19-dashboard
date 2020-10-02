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
import React from "react";

interface LeftColumnProps {
  summaryData: any;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ summaryData }) => {
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
          {summaryData?.Global.TotalConfirmed.toLocaleString()}
        </Heading>
      </Flex>
      <Box bg="blue.400" overflowY="scroll" p={5}>
        <List spacing={1}>
          {summaryData?.Countries.sort(
            (a: any, b: any) => b.TotalConfirmed - a.TotalConfirmed
          ).map((country: any) => (
            <ListItem>
              <Text fontWeight={600} color="red.600" display="inline">
                {country.TotalConfirmed.toLocaleString()}
              </Text>{" "}
              {country.Country}
              <Divider />
            </ListItem>
          ))}
        </List>
      </Box>
      <Flex direction="column" align="center" justify="center" bg="blue.500">
        <Text>Last Updated at</Text>
        <Text fontSize="2xl" fontWeight={500}>
          {new Date(summaryData?.Date).toLocaleString()}
        </Text>
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
