import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { CountryAndCount, TTab } from "../types";
import { changeBg } from "../utils/utils";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

interface RightColumnListProps {
  globalCount: number;
  targetData: CountryAndCount | null;
  sortedData: CountryAndCount[];
  isLoading: boolean;
  tab: TTab;
  handleLiClick: (countryName: string) => void;
}

// -----------  COMPONENT -----------

const RightColumnList: React.FC<RightColumnListProps> = ({
  globalCount,
  targetData,
  sortedData,
  isLoading,
  tab,
  handleLiClick,
}) => {
  const { selectedCountry } = useSelectCountryCtx();
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
        {isLoading ? (
          <Loading />
        ) : sortedData.length > 0 ? (
          <>
            <Heading fontSize={{ base: "xl", lg: "2xl" }} color="white">
              {selectedCountry ? selectedCountry : "Global"}
            </Heading>
            <Heading fontSize={{ base: "2xl", lg: "4xl" }} color={pickColor()}>
              {selectedCountry
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
        {isLoading ? (
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
                    bg={changeBg(selectedCountry, d.country)}
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
