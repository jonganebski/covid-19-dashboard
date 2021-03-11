import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MapContainer } from "react-leaflet";
import { INITIAL_COORDS, INITIAL_ZOOM } from "../constants";
import LeafletMap from "./LeafletMap";
import News from "./News";

export type TMapDataClass = "confirmed" | "active" | "deaths" | "newCases";

interface IMyButtonProps {
  text: string;
  dataClass: TMapDataClass;
  type: TMapDataClass;
  handleBtnClick: (type: TMapDataClass) => void;
}

const MyButton: React.FC<IMyButtonProps> = ({
  text,
  type,
  dataClass,
  handleBtnClick,
}) => (
  <Button
    size="sm"
    w="25%"
    borderTop="none"
    borderTopLeftRadius={0}
    borderTopRightRadius={0}
    variant="outline"
    colorScheme={dataClass === type ? "red" : "gray"}
    onClick={() => handleBtnClick(type)}
  >
    {text}
  </Button>
);

// ------------- COMPONENT -------------

const CenterColumn = () => {
  const [dataClass, setDataClass] = useState<TMapDataClass>("confirmed");
  const handleBtnClick = (type: TMapDataClass) => setDataClass(type);

  return (
    <Grid gridArea="center" gridTemplateRows="auto 250px" gap={1}>
      <Stack spacing={0} pb={2}>
        <Box h="100%">
          <MapContainer
            center={INITIAL_COORDS}
            zoom={INITIAL_ZOOM}
            style={{ width: "100%", height: "100%", fill: "black" }}
          >
            <LeafletMap dataClass={dataClass} />
          </MapContainer>
        </Box>
        <Flex flexDir={{ base: "column", lg: "row" }} justify="space-between">
          <ButtonGroup>
            <MyButton
              dataClass={dataClass}
              handleBtnClick={handleBtnClick}
              text={"Cumulative Cases"}
              type={"confirmed"}
            />
            <MyButton
              dataClass={dataClass}
              handleBtnClick={handleBtnClick}
              text={"Cumulative Deaths"}
              type={"deaths"}
            />
            <MyButton
              dataClass={dataClass}
              handleBtnClick={handleBtnClick}
              text={"Active Cases"}
              type={"active"}
            />
            <MyButton
              dataClass={dataClass}
              handleBtnClick={handleBtnClick}
              text={"New Cases"}
              type={"newCases"}
            />
          </ButtonGroup>
          <Text h="100%" fontSize="13px" color="gray.500">
            NCR: New Cases per 100,000 population for last 7 days
          </Text>
        </Flex>
      </Stack>
      <Flex bg="gray.800">
        <News />
      </Flex>
    </Grid>
  );
};

export default CenterColumn;
