import { Select } from "@chakra-ui/core";
import React from "react";
import { TDailyD } from "../types";

interface RightColumnListSelectProps {
  countryData: TDailyD[] | null;
  setTab: React.Dispatch<
    React.SetStateAction<"active" | "deaths" | "recovered" | "new cases">
  >;
  defaultValue: string;
}

// ----------- COMPONENT -----------

const RightColumnListSelect: React.FC<RightColumnListSelectProps> = ({
  countryData,
  setTab,
  defaultValue,
}) => {
  return (
    <Select
      size="sm"
      backgroundColor="black"
      color="white"
      placeholder="Select option"
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
      <option value="active">
        Active ({countryData && countryData[0].lastUpdate})
      </option>
      <option value="new cases">
        New Cases ({countryData && countryData[0].newCasesLastUpdate})
      </option>
      <option value="deaths">Total deaths (cumulative)</option>
      <option value="recovered">Total recovered (cumulative)</option>
    </Select>
  );
};

export default RightColumnListSelect;
