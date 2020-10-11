import { Flex, Spinner } from "@chakra-ui/core";
import React from "react";

const Loading = () => {
  return (
    <Flex align="center" justify="center" w="100%" h="100%">
      <Spinner thickness="2px" color="red.500" size="lg" />;
    </Flex>
  );
};

export default Loading;
