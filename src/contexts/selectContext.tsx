import React, { createContext, ReactNode, useContext, useState } from "react";
import { TChartTab, TTab } from "../types";

type TSelectContext = {
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  handleLiClick: (countryName: string) => void;
  tabL: TTab;
  setTabL: React.Dispatch<React.SetStateAction<TTab>>;
  tabR: TTab;
  setTabR: React.Dispatch<React.SetStateAction<TTab>>;
  chartTab: TChartTab;
  setChartTab: React.Dispatch<React.SetStateAction<TChartTab>>;
};

const SelectContext = createContext<Partial<TSelectContext>>({});

interface SelectContextProviderProps {
  children: ReactNode;
}

const SelectContextProvider: React.FC<SelectContextProviderProps> = ({
  children,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [tabL, setTabL] = useState<TTab>("active");
  const [tabR, setTabR] = useState<TTab>("new cases");
  const [chartTab, setChartTab] = useState<TChartTab>("daily cases");
  const handleLiClick = (countryName: string) => {
    setSelectedCountry((prev) => (prev === countryName ? "" : countryName));
  };
  return (
    <SelectContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        handleLiClick,
        tabL,
        setTabL,
        tabR,
        setTabR,
        chartTab,
        setChartTab,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

export const useSelectCountryCtx = () => {
  const { selectedCountry, setSelectedCountry, handleLiClick } = useContext(
    SelectContext
  );

  if (
    typeof selectedCountry !== "undefined" &&
    setSelectedCountry &&
    handleLiClick
  ) {
    return { selectedCountry, setSelectedCountry, handleLiClick };
  } else {
    throw new Error();
  }
};

export const useTabSelectionCtx = () => {
  const { tabL, setTabL, tabR, setTabR, chartTab, setChartTab } = useContext(
    SelectContext
  );
  if (tabL && setTabL && tabR && setTabR && chartTab && setChartTab) {
    return { tabL, setTabL, tabR, setTabR, chartTab, setChartTab };
  } else {
    throw new Error();
  }
};

export default SelectContextProvider;
