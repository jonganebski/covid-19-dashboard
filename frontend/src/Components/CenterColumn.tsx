import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { TDailyD, TNewsData } from "../types";
import LeafletMap from "./LeafletMap";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

interface CenterColumnProps {
  countryData: TDailyD[] | null;
  provinceData: TDailyD[] | null;
  newsData: TNewsData[] | null;
  isNewsLoading: boolean;
  isCsvLoading: boolean;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}
export type TMapDataClass = "confirmed" | "active" | "deaths" | "newCases";

// ------------- COMPONENT -------------

const CenterColumn: React.FC<CenterColumnProps> = ({
  countryData,
  provinceData,
  newsData,
  isNewsLoading,
  isCsvLoading,
  selected,
  setSelected,
}) => {
  const [dataClass, setDataClass] = useState<TMapDataClass>("confirmed");
  const handleBtnClick = (type: TMapDataClass) => setDataClass(type);

  return (
    <Grid gridArea="center" gridTemplateRows="auto 250px" gap={1}>
      <Stack spacing={0} pb={2}>
        <Box h="100%">
          {isCsvLoading ? (
            <Loading />
          ) : countryData && provinceData ? (
            <LeafletMap
              countryData={countryData}
              provinceData={provinceData}
              selected={selected}
              setSelected={setSelected}
              dataClass={dataClass}
            />
          ) : (
            <LoadingFailed />
          )}
        </Box>
        {countryData && provinceData && (
          <ButtonGroup>
            <Button
              size="sm"
              borderTop="none"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              variant="outline"
              variantColor={dataClass === "confirmed" ? "red" : "gray"}
              onClick={() => handleBtnClick("confirmed")}
            >
              Cumulative Cases
            </Button>

            <Button
              size="sm"
              borderTop="none"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              variant="outline"
              variantColor={dataClass === "deaths" ? "red" : "gray"}
              onClick={() => handleBtnClick("deaths")}
            >
              Cumulative Deaths
            </Button>
            <Button
              size="sm"
              borderTop="none"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              variant="outline"
              variantColor={dataClass === "active" ? "red" : "gray"}
              onClick={() => handleBtnClick("active")}
            >
              Active Cases
            </Button>
            <Button
              size="sm"
              borderTop="none"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              variant="outline"
              variantColor={dataClass === "newCases" ? "red" : "gray"}
              onClick={() => handleBtnClick("newCases")}
            >
              New Cases
            </Button>
          </ButtonGroup>
        )}
      </Stack>
      <Flex bg="gray.800">
        {isNewsLoading ? (
          <Loading />
        ) : (
          <>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              w="130px"
              color="gray.300"
              marginX={1}
            >
              <Text fontSize={20} textAlign="center" mb={1}>
                Recent COVID-19 News
              </Text>
              <Text fontSize={15} textAlign="center">
                ({selected ? selected : "Global"})
              </Text>
            </Flex>
            {newsData && newsData.length > 0 ? (
              <Stack w="100%" overflowY="scroll">
                {newsData.map((news, i) => (
                  <Link key={i} href={news.link} target="_blank" mr={1}>
                    <Box border="1px gray solid" borderRadius="5px" p={5}>
                      <Heading size="md" color="gray.400" mb={1}>
                        {news.title}
                      </Heading>
                      <Text fontSize="xs" color="gray.500">
                        {news.source} | {news.date}
                      </Text>
                    </Box>
                  </Link>
                ))}
              </Stack>
            ) : (
              <LoadingFailed />
            )}
          </>
        )}
      </Flex>
    </Grid>
  );
};

export default CenterColumn;
