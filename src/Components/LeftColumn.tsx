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
import { useCountryDataCtx } from "../contexts/dataContext";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { changeBg, getCountryCount, getTotalCount } from "../utils/utils";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

// ------------- COMPONENT -------------

const LeftColumn = () => {
  const listBoxRef = useRef<HTMLDivElement | null>(null);

  const { selectedCountry, handleLiClick } = useSelectCountryCtx();
  const { isLoading, error, data } = useCountryDataCtx();
  return (
    <Grid gridArea="left" bg="black" gridTemplateRows="2fr 12fr 1.5fr" gap={1}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={2}
        bg="gray.700"
      >
        {isLoading ? (
          <Loading />
        ) : error ? (
          <LoadingFailed />
        ) : (
          <>
            <Heading
              fontSize={{ base: "lg", lg: "xl" }}
              color="gray.400"
              mr={1}
            >
              Total Cases
            </Heading>
            <Heading fontSize={{ base: "xl", lg: "2xl" }} color="white">
              {selectedCountry ? selectedCountry : "Global"}
            </Heading>
            <Heading fontSize={{ base: "2xl", lg: "4xl" }} color="red.500">
              {selectedCountry === ""
                ? getTotalCount(data, "confirmed")
                : getCountryCount(data, selectedCountry, "confirmed")}
            </Heading>
            <Text fontSize="xs" color="gray.400">
              (cumulative)
            </Text>{" "}
          </>
        )}
      </Flex>
      <Box bg="gray.800" overflowY="scroll" paddingX={5} ref={listBoxRef}>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <LoadingFailed />
        ) : (
          <List spacing={1}>
            {data
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
                    bg={changeBg(selectedCountry, d.country)}
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
        {isLoading ? (
          <Loading />
        ) : error ? (
          <LoadingFailed />
        ) : (
          <>
            <Text color="gray.400">Last Updated at</Text>
            <Text color="gray.400" fontSize="2xl" fontWeight={500}>
              {data && new Date(data[0]?.lastUpdate).toLocaleString()}
            </Text>
          </>
        )}
      </Flex>
    </Grid>
  );
};

export default LeftColumn;
