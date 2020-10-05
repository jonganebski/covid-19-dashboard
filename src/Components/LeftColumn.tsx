import {
  Box,
  Flex,
  FlexProps,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/core";
import React, { SyntheticEvent, useEffect, useMemo, useRef } from "react";
import { TDailyD } from "../App";

interface LeftColumnProps {
  dailyData: {
    countryWise: TDailyD[];
    provinceWise: TDailyD[];
  } | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  handleLiClick: (countryName: string) => void;
  scrollList: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
}

const LeftColumn: React.FC<LeftColumnProps> = ({
  dailyData,
  selected,
  setSelected,
  handleLiClick,
  scrollList,
}) => {
  const listBoxRef = useRef<HTMLDivElement | null>(null);
  const totalConfirmed = useMemo(() => {
    let count = 0;
    dailyData?.countryWise.forEach((d) => {
      count = count + d.Confirmed;
    });
    return count;
  }, [dailyData]);

  useEffect(() => {
    scrollList(listBoxRef);
  }, [selected, scrollList]);

  const changeBg = (countryName: string) =>
    selected === countryName ? "red.100" : "none";

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
            ? totalConfirmed.toLocaleString()
            : dailyData?.countryWise
                .filter((d) => d.Country_Region === selected)[0]
                .Confirmed.toLocaleString()}
        </Heading>
      </Flex>
      <Box bg="blue.400" overflowY="scroll" p={5} ref={listBoxRef}>
        <List spacing={1}>
          {dailyData?.countryWise
            .slice()
            .sort((a, b) => b.Confirmed - a.Confirmed)
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
                    {d.Confirmed.toLocaleString()}
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
          {dailyData &&
            new Date(dailyData.countryWise[0].Last_Update).toLocaleString()}
        </Text>
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
