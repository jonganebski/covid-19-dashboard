import { Grid, Stack, Box, Text, Link } from "@chakra-ui/core";
import React from "react";
import { TdataForMap } from "../App";
import MapWithCircles from "./MapWithCircles";

interface CenterColumnProps {
  dataForMap: TdataForMap | null;
}

const CenterColumn: React.FC<CenterColumnProps> = ({ dataForMap }) => {
  return (
    <Grid gridArea="center" gridTemplateRows="7fr 1fr" gap={1}>
      <Stack bg="green.300">
        {dataForMap && <MapWithCircles data={dataForMap} />}
      </Stack>
      <Box bg="green.700">
        <Text>
          This page is a result of clone coding following webpage:
          <Link href="https://bit.ly/31YewhF" target="_blank">
            https://bit.ly/31YewhF
          </Link>
        </Text>
        <Text>
          Data sources:{" "}
          <Link href="https://api.covid19api.com" target="_blank">
            https://api.covid19api.com
          </Link>
          ,{" "}
          <Link
            href="https://github.com/CSSEGISandData/COVID-19"
            target="_blank"
          >
            https://github.com/CSSEGISandData/COVID-19
          </Link>{" "}
        </Text>
      </Box>
    </Grid>
  );
};

export default CenterColumn;
