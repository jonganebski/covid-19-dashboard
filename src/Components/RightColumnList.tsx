import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/core";
import React from "react";
import { TListD } from "../types";
import { changeBg } from "../utils/utils";
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
      <Flex
        mb={1}
        direction="column"
        align="center"
        justify="center"
        bg="gray.700"
      >
        <Heading size="lg" color="gray.400">
          {selected ? selected : "Global"}
        </Heading>
        <Text fontSize="xs" color="gray.400">
          ({new Date(lastUpdate).toLocaleString()})
        </Text>
        <Heading size="xl" color="red.500">
          {selected
            ? countryCount === null || countryCount === undefined
              ? "No data"
              : countryCount.toLocaleString()
            : globalCount.toLocaleString()}
        </Heading>
      </Flex>
      <Box overflowY="scroll" paddingX={5} bg="gray.800">
        <List spacing={1}>
          {sortedData &&
            sortedData.map((d, i) => {
              const li = (
                <ListItem
                  key={i}
                  paddingY={1}
                  m={0}
                  borderBottom="1px solid"
                  borderBottomColor="gray.500"
                  cursor="pointer"
                  onClick={() => handleLiClick(d.country)}
                  bg={changeBg(selected, d.country)}
                >
                  <Text fontWeight={600} color="red.500">
                    {d.count === null
                      ? "No data"
                      : `${d.count.toLocaleString()} ${tab}`}
                  </Text>
                  <Text color="gray.400">{d.country}</Text>
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
