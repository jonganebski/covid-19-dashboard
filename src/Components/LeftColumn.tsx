import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import React, { useMemo, useRef } from "react";
import { TDailyD } from "../types";
import { changeBg } from "../utils/utils";

interface LeftColumnProps {
  countryData: TDailyD[] | null;
  selected: string;
  handleLiClick: (countryName: string) => void;
}

const LeftColumn: React.FC<LeftColumnProps> = ({
  countryData,
  selected,
  handleLiClick,
}) => {
  const listBoxRef = useRef<HTMLDivElement | null>(null);

  const totalCount = useMemo(() => {
    let confirmed = 0;
    let deaths = 0;
    let recovered = 0;
    countryData?.forEach((d) => {
      confirmed = confirmed + (d.confirmed ?? 0);
      deaths = deaths + (d.deaths ?? 0);
      recovered = recovered + (d.recovered ?? 0);
    });
    return { confirmed, deaths, recovered };
  }, [countryData]);

  return (
    <Grid gridArea="left" bg="black" gridTemplateRows="2fr 12fr 1.5fr" gap={1}>
      <Flex direction="column" align="center" justify="center" bg="gray.700">
        <Heading size="md" color="gray.400">
          Total Cases
        </Heading>
        <Text fontSize="xs" color="gray.400">
          (cumulative)
        </Text>
        <Heading size="lg" color="gray.400">
          {selected ? selected : "Global"}
        </Heading>
        <Heading size="xl" color="red.500">
          {selected === ""
            ? totalCount.confirmed.toLocaleString()
            : countryData
                ?.filter((d) => d.country === selected)[0]
                .confirmed?.toLocaleString() ?? "No data"}
        </Heading>
      </Flex>
      <Box bg="gray.800" overflowY="scroll" p={5} ref={listBoxRef}>
        <List spacing={1}>
          {countryData
            ?.filter((d) => d.confirmed)
            .sort((a, b) => b.confirmed! - a.confirmed!)
            .map((d, i) => {
              return (
                <ListItem
                  display="flex"
                  key={i}
                  paddingY={2}
                  m={0}
                  borderBottom="1px solid"
                  borderBottomColor="gray.500"
                  cursor="pointer"
                  onClick={() => handleLiClick(d.country)}
                  bg={changeBg(selected, d.country)}
                >
                  <Text fontWeight={600} color="red.500" mr={2}>
                    {d.confirmed?.toLocaleString() ?? "No data"}
                  </Text>
                  <Text color="gray.400">{d.country}</Text>
                </ListItem>
              );
            })}
        </List>
      </Box>
      <Flex direction="column" align="center" justify="center" bg="gray.800">
        <Text color="gray.400">Last Updated at</Text>
        <Text color="gray.400" fontSize="2xl" fontWeight={500}>
          {countryData && new Date(countryData[0].lastUpdate).toLocaleString()}
        </Text>
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
