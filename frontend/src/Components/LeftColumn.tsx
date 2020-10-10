import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import React, { useRef } from "react";
import { TDailyD } from "../types";
import { changeBg } from "../utils/utils";
import Loading from "./Loading";

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

  let totalCount = 0;
  countryData?.forEach((d) => {
    totalCount = totalCount + (d.confirmed ?? 0);
  });

  return (
    <Grid gridArea="left" bg="black" gridTemplateRows="2fr 12fr 1.5fr" gap={1}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={2}
        bg="gray.700"
      >
        {!countryData ? (
          <Loading />
        ) : (
          <>
            <Heading size="lg" color="gray.400" mr={1}>
              Total Cases
            </Heading>
            <Heading size="lg" color="white">
              {selected ? selected : "Global"}
            </Heading>
            <Heading size="xl" color="red.500">
              {selected === ""
                ? totalCount.toLocaleString()
                : countryData
                    ?.filter((d) => d.country === selected)[0]
                    .confirmed?.toLocaleString() ?? "No data"}
            </Heading>
            <Text fontSize="xs" color="gray.400">
              (cumulative)
            </Text>{" "}
          </>
        )}
      </Flex>
      <Box bg="gray.800" overflowY="scroll" paddingX={5} ref={listBoxRef}>
        {!countryData ? (
          <Loading />
        ) : (
          <List spacing={1}>
            {countryData
              .filter((d) => d.confirmed)
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
                    <Text color="gray.100">{d.country}</Text>
                  </ListItem>
                );
              })}
          </List>
        )}
      </Box>
      <Flex direction="column" align="center" justify="center" bg="gray.800">
        {!countryData ? (
          <Loading />
        ) : (
          <>
            <Text color="gray.400">Last Updated at</Text>
            <Text color="gray.400" fontSize="2xl" fontWeight={500}>
              {countryData &&
                new Date(countryData[0].lastUpdate).toLocaleString()}
            </Text>
          </>
        )}
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
