import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Stack,
  Text,
} from "@chakra-ui/core";
import React, { useState } from "react";
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
    borderTop="none"
    borderTopLeftRadius={0}
    borderTopRightRadius={0}
    variant="outline"
    variantColor={dataClass === type ? "red" : "gray"}
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
          <LeafletMap dataClass={dataClass} />
        </Box>
        <Flex>
          <ButtonGroup mr={5}>
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
          <Text fontSize="13px" color="gray.500">
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
