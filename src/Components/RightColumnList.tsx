import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/core";
import React from "react";
import { TListD } from "../types";
import { TTab } from "./RightColumn";

interface RightColumnListProps {
  selected: string;
  globalCount: number;
  lastUpdate: number;
  targetData: TListD | null;
  sortedData: TListD[];
  tab: TTab;
  handleLiClick: (countryName: string) => void;
}

const RightColumnList: React.FC<RightColumnListProps> = ({
  selected,
  globalCount,
  lastUpdate,
  targetData,
  sortedData,
  tab,
  handleLiClick,
}) => {
  const countryCount = targetData?.count;
  return (
    <>
      <Flex mb={5} direction="column" align="center" justify="center">
        <Heading size="lg">{selected ? selected : "Global"}</Heading>
        <Text fontSize="sm">({new Date(lastUpdate).toLocaleString()})</Text>
        <Heading size="xl" color="red.600">
          {selected
            ? countryCount === null || countryCount === undefined
              ? "No data"
              : countryCount.toLocaleString()
            : globalCount.toLocaleString()}
        </Heading>
      </Flex>
      <Box overflowY="scroll" paddingX={5}>
        <List spacing={1}>
          {sortedData &&
            sortedData.map((d, i) => {
              const li = (
                <ListItem
                  key={i}
                  paddingY={1}
                  m={0}
                  borderBottom="1px solid"
                  borderBottomColor="gray.50"
                  cursor="pointer"
                  onClick={() => handleLiClick(d.country)}
                  bg={selected === d.country ? "blue.300" : "none"}
                >
                  <Text fontWeight={600} color="gray.200">
                    {d.count === null
                      ? "No data"
                      : `${d.count.toLocaleString()} ${tab}`}
                  </Text>
                  <Text>{d.country}</Text>
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
