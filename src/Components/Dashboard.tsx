import { Flex, Grid } from "@chakra-ui/core";
import React, { useState } from "react";
import Header from "./Header";
import LeftColumn from "./LeftColumn";

// -----------  COMPONENT  -----------

const Dashboard = () => {
  // const [newsData, setNewsData] = useState<TNewsData[] | null>(null);
  // const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [selected, setSelected] = useState("");

  // console.log("Dashboard Rendering");
  // console.log("timeData", timeData);
  // console.log("countryData", countryData);
  // console.log("provinceData", provinceData);
  // console.log("Dashboard newsData: ", newsData);
  console.log("dashboard rendering");
  const handleLiClick = (countryName: string) => {
    setSelected((prev) => (prev === countryName ? "" : countryName));
  };

  // Gets news data
  // useEffect(() => {
  //   setIsNewsLoading(true);
  //   newsApi(selected)
  //     .then((result) => setNewsData(result))
  //     .finally(() => setIsNewsLoading(false));
  // }, [selected]);

  return (
    <Flex className="App" p={1} w="100vw" h="100vh" bg="black">
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
        <LeftColumn selected={selected} handleLiClick={handleLiClick} />
        {/* <CenterColumn
          newsData={newsData}
          isNewsLoading={isNewsLoading}
          selected={selected}
          setSelected={setSelected}
        /> */}
        {/* <RightColumn selected={selected} handleLiClick={handleLiClick} /> */}
      </Grid>
    </Flex>
  );
};

export default Dashboard;
