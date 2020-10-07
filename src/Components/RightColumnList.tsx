import {
  Flex,
  Heading,
  Box,
  List,
  ListItem,
  Divider,
  Text,
} from "@chakra-ui/core";
import React from "react";
import { TDailyD, TListD } from "../types";
import { TTab } from "./RightColumn";

interface RightColumnListProps {
  selected: string;
  globalCount: number;
  lastUpdate: number;
  // targetData: TDailyD | null;
  sortedData: TListD[];
  tab: TTab;
  listContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleLiClick: (countryName: string) => void;
}

const RightColumnList: React.FC<RightColumnListProps> = ({
  selected,
  globalCount,
  lastUpdate,
  // targetData,
  sortedData,
  tab,
  listContainerRef,
  handleLiClick,
}) => {
  return (
    <>
      <Flex mb={5} direction="column" align="center" justify="center">
        <Heading size="lg">{selected ? selected : "Global"}</Heading>
        <Text fontSize="sm">({new Date(lastUpdate).toLocaleString()})</Text>
        <Heading size="xl" color="red.600">
          {selected ? "country count!!" : globalCount.toLocaleString()}
        </Heading>
      </Flex>
      <Box overflowY="scroll" paddingX={5} ref={listContainerRef}>
        <List spacing={1}>
          {sortedData &&
            sortedData.map((d, i) => {
              const li = (
                <ListItem
                  key={i}
                  id={i.toString()}
                  cursor="pointer"
                  onClick={() => handleLiClick(d.country)}
                  bg={selected === d.country ? "blue.300" : "none"}
                >
                  <Text fontWeight={600} color="gray.200">
                    {d.count ? `${d.count.toLocaleString()} ${tab}` : "No data"}
                  </Text>
                  <Text id={d.country.replace(/\s+/g, "")}>{d.country}</Text>
                  <Divider />
                </ListItem>
              );
              return li;
            })}
        </List>
      </Box>
    </>
  );
};

export default RightColumnList;
