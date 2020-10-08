import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { TDailyD } from "../types";
import LeafletMap from "./LeafletMap";
import Loading from "./Loading";

interface CenterColumnProps {
  countryData: TDailyD[] | null;
  provinceData: TDailyD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}
export type TMapDataClass = "confirmed" | "active" | "deaths" | "newCases";

// ------------- COMPONENT -------------

const CenterColumn: React.FC<CenterColumnProps> = ({
  countryData,
  provinceData,
  selected,
  setSelected,
}) => {
  const [dataClass, setDataClass] = useState<TMapDataClass>("confirmed");
  const handleBtnClick = (type: TMapDataClass) => setDataClass(type);

  return (
    <Grid gridArea="center" gridTemplateRows="5fr 1fr" gap={1}>
      <Stack spacing={0} pb={2}>
        <Box h="100%">
          {!countryData && !provinceData ? (
            <Loading />
          ) : (
            <LeafletMap
              countryData={countryData}
              provinceData={provinceData}
              selected={selected}
              setSelected={setSelected}
              dataClass={dataClass}
            />
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
      <Box bg="gray.800">
        <Text color="gray.400">
          This page is a result of clone coding following webpage:
          <Link href="https://bit.ly/31YewhF" target="_blank">
            https://bit.ly/31YewhF
          </Link>
        </Text>
        <Text color="gray.400">
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
