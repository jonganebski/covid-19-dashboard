import { WarningIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
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
      <WarningIcon size="20px" />
      <Text fontSize="10px">loading failed</Text>
    </Flex>
  );
};

export default LoadingFailed;
