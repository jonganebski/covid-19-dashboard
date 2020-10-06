import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import React, { useEffect, useMemo, useRef } from "react";
import { TDailyD } from "../types";

interface LeftColumnProps {
  countryData: TDailyD[] | null;
  selected: string;
  handleLiClick: (countryName: string) => void;
  scrollList: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
}

const LeftColumn: React.FC<LeftColumnProps> = ({
  countryData,
  selected,
  handleLiClick,
  scrollList,
}) => {
  const listBoxRef = useRef<HTMLDivElement | null>(null);

  const totalCount = useMemo(() => {
    let confirmed = 0;
    let deaths = 0;
    let recovered = 0;
    countryData?.forEach((d) => {
      confirmed = confirmed + (d.Confirmed ?? 0);
      deaths = deaths + (d.Deaths ?? 0);
      recovered = recovered + (d.Recovered ?? 0);
    });
    return { confirmed, deaths, recovered };
  }, [countryData]);

  const changeBg = (countryName: string) =>
    selected === countryName ? "red.100" : "none";

  useEffect(() => {
    scrollList(listBoxRef);
  }, [selected, scrollList]);

  return (
    <Grid
      gridArea="left"
      bg="blue.200"
      gridTemplateRows="2fr 12fr 1.5fr"
      gap={1}
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="md">Total Cases</Heading>
        <Heading size="lg">{selected ? selected : "Global"}</Heading>
        <Text fontSize="sm">(cumulative)</Text>
        <Heading size="xl" color="red.600">
          {selected === ""
            ? totalCount.confirmed.toLocaleString()
            : countryData
                ?.filter((d) => d.Country_Region === selected)[0]
                .Confirmed?.toLocaleString() ?? "No data"}
        </Heading>
      </Flex>
      <Box bg="blue.400" overflowY="scroll" p={5} ref={listBoxRef}>
        <List spacing={1}>
          {countryData
            ?.filter((d) => d.Confirmed)
            .sort((a, b) => b.Confirmed! - a.Confirmed!)
            .map((d, i) => {
              return (
                <ListItem
                  display="flex"
                  key={i}
                  id={i.toString()}
                  pt={2}
                  pb={2}
                  m={0}
                  borderBottom="1px solid"
                  borderBottomColor="gray.50"
                  cursor="pointer"
                  onClick={() => handleLiClick(d.Country_Region)}
                  bg={changeBg(d.Country_Region)}
                >
                  <Text fontWeight={600} color="red.600" mr={2}>
                    {d.Confirmed?.toLocaleString() ?? "No data"}
                  </Text>
                  <Text id={d.Country_Region.replace(/\s+/g, "")}>
                    {d.Country_Region}
                  </Text>
                </ListItem>
              );
            })}
        </List>
      </Box>
      <Flex direction="column" align="center" justify="center" bg="blue.500">
        <Text>Last Updated at</Text>
        <Text fontSize="2xl" fontWeight={500}>
          {countryData && new Date(countryData[0].Last_Update).toLocaleString()}
        </Text>
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
