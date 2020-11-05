import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useCountryDataCtx, useProvinceDataCtx } from "../contexts/dataContext";
import { TDailyD } from "../types";
import { changeBg } from "../utils/utils";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

interface LeftColumnProps {
  selected: string;
  handleLiClick: (countryName: string) => void;
}

// ------------- COMPONENT -------------

const LeftColumn: React.FC<LeftColumnProps> = ({ selected, handleLiClick }) => {
  const listBoxRef = useRef<HTMLDivElement | null>(null);

  const { isLoading, data } = useCountryDataCtx();
  const [totalCount, setTotalCount] = useState(0);

  // useEffect(() => {
  //   setTotalCount((prev) => {
  //     data?.forEach((d) => {
  //       prev = prev + (d.confirmed ?? 0);
  //     });
  //     return prev;
  //   });
  // }, [data]);

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
              {selected ? selected : "Global"}
            </Heading>
            <Heading fontSize={{ base: "2xl", lg: "4xl" }} color="red.500">
              {selected === ""
                ? totalCount.toLocaleString()
                : data
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
        {isLoading ? (
          <Loading />
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
        {isLoading ? (
          <Loading />
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
