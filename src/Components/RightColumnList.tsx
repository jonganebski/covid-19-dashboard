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
import { TDailyD } from "../types";
import { TTab } from "./RightColumn";

interface RightColumnListProps {
  selected: string;
  totalCount: {
    active: number;
    deaths: number;
    recovered: number;
    newCases: number;
  } | null;
  targetData: TDailyD | null;
  sortedData: {
    active: {
      country: string;
      count: number | null;
    }[];
    deaths: {
      country: string;
      count: number | null;
    }[];
    recovered: {
      country: string;
      count: number | null;
    }[];
    date: string;
    newCases: {
      country: string;
      count: number | null;
      date: number;
    }[];
  } | null;
  tab: TTab;
  listContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleLiClick: (countryName: string) => void;
}

const RightColumnList: React.FC<RightColumnListProps> = ({
  selected,
  totalCount,
  targetData,
  sortedData,
  tab,
  listContainerRef,
  handleLiClick,
}) => {
  const getCount = () => {
    switch (tab) {
      case "active": {
        if (selected) {
          return targetData?.Active ?? "No data";
        } else {
          return totalCount?.active ?? "No data";
        }
      }
      case "deaths": {
        if (selected) {
          return targetData?.Deaths ?? "No data";
        } else {
          return totalCount?.deaths ?? "No data";
        }
      }
      case "recovered": {
        if (selected) {
          return targetData?.Recovered ?? "No data";
        } else {
          return totalCount?.recovered ?? "No data";
        }
      }
      case "new cases": {
        if (selected) {
          return sortedData?.newCases.find((d) => d.country === selected)
            ?.count;
        } else {
          return totalCount?.newCases ?? "No data";
        }
      }
    }
  };
  console.log("sorted data: ", sortedData);
  return (
    <>
      <Flex mb={5} direction="column" align="center" justify="center">
        <Heading size="lg">{selected ? selected : "Global"}</Heading>
        <Text fontSize="sm">({sortedData?.date})</Text>
        <Heading size="xl" color="red.600">
          {getCount()?.toLocaleString()}
        </Heading>
      </Flex>
      <Box overflowY="scroll" paddingX={5} ref={listContainerRef}>
        <List spacing={1}>
          {tab !== "new cases" &&
            sortedData &&
            sortedData[tab].map((d, i) => {
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
          {tab === "new cases" &&
            sortedData &&
            sortedData.newCases.map((d, i) => {
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
