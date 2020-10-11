import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/core";
import React from "react";
import { TListD, TTab } from "../types";
import { changeBg } from "../utils/utils";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

interface RightColumnListProps {
  selected: string;
  globalCount: number;
  targetData: TListD | null;
  sortedData: TListD[];
  isCsvLoading: boolean;
  tab: TTab;
  handleLiClick: (countryName: string) => void;
}

// -----------  COMPONENT -----------

const RightColumnList: React.FC<RightColumnListProps> = ({
  selected,
  globalCount,
  targetData,
  sortedData,
  isCsvLoading,
  tab,
  handleLiClick,
}) => {
  const countryCount = targetData?.count;
  const pickColor = () =>
    tab === "active"
      ? "yellow.500"
      : tab === "deaths"
      ? "gray.500"
      : tab === "recovered"
      ? "green.500"
      : "pink.500";

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="gray.700"
        borderBottomWidth={1}
        borderBottom="solid black"
      >
        {isCsvLoading ? (
          <Loading />
        ) : sortedData.length > 0 ? (
          <>
            <Heading size="lg" color="white">
              {selected ? selected : "Global"}
            </Heading>
            <Heading size="xl" color={pickColor()}>
              {selected
                ? countryCount === null || countryCount === undefined
                  ? "No data"
                  : countryCount.toLocaleString()
                : globalCount.toLocaleString()}
            </Heading>{" "}
          </>
        ) : (
          <LoadingFailed />
        )}
      </Flex>
      <Box overflowY="scroll" paddingX={5} bg="gray.800">
        {isCsvLoading ? (
          <Loading />
        ) : sortedData.length > 0 ? (
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
                    <Text fontWeight={600} color={pickColor()}>
                      {d.count === null
                        ? "No data"
                        : `${d.count.toLocaleString()} ${tab}`}
                    </Text>
                    <Text color="gray.100">{d.country}</Text>
                  </ListItem>
                );
                return li;
              })}
          </List>
        ) : (
          <LoadingFailed />
        )}
      </Box>
    </>
  );
};

export default RightColumnList;
