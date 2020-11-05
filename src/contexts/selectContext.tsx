import React, { createContext, ReactNode, useContext, useState } from "react";

type TSelectContext = {
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  handleLiClick: (countryName: string) => void;
};

const SelectContext = createContext<Partial<TSelectContext>>({});

interface SelectContextProviderProps {
  children: ReactNode;
}

const SelectContextProvider: React.FC<SelectContextProviderProps> = ({
  children,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const handleLiClick = (countryName: string) => {
    setSelectedCountry((prev) => (prev === countryName ? "" : countryName));
  };
  return (
    <SelectContext.Provider
      value={{ selectedCountry, setSelectedCountry, handleLiClick }}
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

export default SelectContextProvider;
