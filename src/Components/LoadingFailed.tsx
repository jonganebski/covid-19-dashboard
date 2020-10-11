import { Flex, Icon, Text } from "@chakra-ui/core";
import React from "react";

const LoadingFailed = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100%"
      h="100%"
      color="gray.400"
    >
      <Icon name="warning" size="20px" />
      <Text fontSize="10px">loading failed</Text>
    </Flex>
  );
};

export default LoadingFailed;
