import { Select } from "@chakra-ui/react";
import React from "react";
import { useCountryDataCtx } from "../contexts/dataContext";
import Option from "./Option";

interface RightColumnListSelectProps {
  setTab: React.Dispatch<
    React.SetStateAction<"active" | "deaths" | "recovered" | "new cases">
  >;
  defaultValue: string;
}

// ----------- COMPONENT -----------

const RightColumnListSelect: React.FC<RightColumnListSelectProps> = ({
  setTab,
  defaultValue,
}) => {
  const { isLoading, data } = useCountryDataCtx();
  return isLoading ? null : (
    <Select
      size="sm"
      bg="black"
      color="white"
      defaultValue={defaultValue}
      onChange={(e) => {
        if (
          e.currentTarget.value === "active" ||
          e.currentTarget.value === "deaths" ||
          e.currentTarget.value === "recovered" ||
          e.currentTarget.value === "new cases"
        ) {
          setTab(e.currentTarget.value);
        }
      }}
    >
      <Option text={`Active (${data && data[0].lastUpdate})`} value="active" />
      <Option
        text={`New Cases (${data && data[0].newCasesLastUpdate})`}
        value="new cases"
      />
      <Option text="Total deaths (cumulative)" value="deaths" />
      <Option text="Total recovered (cumulative)" value="recovered" />
    </Select>
  );
};

export default RightColumnListSelect;
