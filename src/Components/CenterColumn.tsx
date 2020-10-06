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

interface CenterColumnProps {
  countryData: TDailyD[] | null;
  provinceData: TDailyD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}
export type TMapDataClass =
  | "Confirmed"
  | "Active"
  | "Deaths"
  | "CaseFatality_Ratio";

const CenterColumn: React.FC<CenterColumnProps> = ({
  countryData,
  provinceData,
  selected,
  setSelected,
}) => {
  const [dataClass, setDataClass] = useState<TMapDataClass>("Confirmed");
  const handleBtnClick = (type: TMapDataClass) => setDataClass(type);

  return (
    <Grid gridArea="center" gridTemplateRows="5fr 1fr" gap={1}>
      <Stack spacing={0} pb={2}>
        <Box h="100%">
          <LeafletMap
            countryData={countryData}
            provinceData={provinceData}
            selected={selected}
            setSelected={setSelected}
            dataClass={dataClass}
          />
        </Box>
        <ButtonGroup>
          <Button
            size="sm"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            onClick={() => handleBtnClick("Confirmed")}
          >
            Cumulative Cases
          </Button>
          <Button
            size="sm"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            onClick={() => handleBtnClick("Active")}
          >
            Active Cases
          </Button>
          <Button
            size="sm"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            onClick={() => handleBtnClick("Deaths")}
          >
            Cumulative Deaths
          </Button>
          <Button
            size="sm"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            onClick={() => handleBtnClick("CaseFatality_Ratio")}
          >
            Case-Fatality Radio
          </Button>
        </ButtonGroup>
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
