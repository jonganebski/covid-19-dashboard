import { Select } from "@chakra-ui/core";
import React from "react";
import { useCountryDataCtx } from "../contexts/dataContext";

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
      <option value="active">Active ({data && data[0].lastUpdate})</option>
      <option value="new cases">
        New Cases ({data && data[0].newCasesLastUpdate})
      </option>
      <option value="deaths">Total deaths (cumulative)</option>
      <option value="recovered">Total recovered (cumulative)</option>
    </Select>
  );
};

export default RightColumnListSelect;
