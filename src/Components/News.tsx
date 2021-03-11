import { Flex, Stack, Link, Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { useNewsData } from "../hooks/useNewsData";
import Loading from "./Loading";
import LoadingFailed from "./LoadingFailed";

const News = () => {
  const { selectedCountry } = useSelectCountryCtx();
  const [isLoading, error, newsData] = useNewsData(selectedCountry);

  return isLoading ? (
    <Loading />
  ) : error ? (
    <LoadingFailed />
  ) : (
    <>
      <Flex
        flexDirection="column"
        align="center"
        justify="center"
        w="130px"
        color="gray.300"
        marginX={1}
      >
        <Text fontSize={20} textAlign="center" mb={1}>
          Recent COVID-19 News
        </Text>
        <Text fontSize={15} textAlign="center">
          ({selectedCountry ? selectedCountry : "Global"})
        </Text>
      </Flex>
      {newsData && newsData.length > 0 && (
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
      )}
    </>
  );
};

export default News;
