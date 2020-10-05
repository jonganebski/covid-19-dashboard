import { Box, Grid, Link, Stack, Text } from "@chakra-ui/core";
import React from "react";
import { TDailyCountryD } from "../types";
import LeafletMap from "./LeafletMap";

interface CenterColumnProps {
  dailyData: TDailyCountryD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const CenterColumn: React.FC<CenterColumnProps> = ({
  dailyData,
  selected,
  setSelected,
}) => {
  return (
    <Grid gridArea="center" gridTemplateRows="5fr 1fr" gap={1}>
      <Stack bg="green.300">
        <LeafletMap
          dailyData={dailyData}
          selected={selected}
          setSelected={setSelected}
        />
      </Stack>
      <Box bg="green.700">
        <Text>
          This page is a result of clone coding following webpage:
          <Link href="https://bit.ly/31YewhF" target="_blank">
            https://bit.ly/31YewhF
          </Link>
        </Text>
        <Text>
          Data source:{" "}
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
