import { Flex, Grid } from "@chakra-ui/core";
import React from "react";
import CenterColumn from "./CenterColumn";
import Header from "./Header";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

// -----------  COMPONENT  -----------

const Dashboard = () => {
  return (
    <Flex className="App" w="100vw" h="100vh" bg="black">
      <Grid
        w="100%"
        gap={1}
        templateAreas={{
          base: `"header" "left" "center" "right"`,
          lg: '"header header header" "left center right"',
        }}
        templateColumns={{ base: "1fr", lg: "3fr 9fr 5fr" }}
        templateRows={{ base: "50px 400px 600px 750px", lg: "5vh 94vh" }}
      >
        <Header />
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </Grid>
    </Flex>
  );
};

export default Dashboard;
