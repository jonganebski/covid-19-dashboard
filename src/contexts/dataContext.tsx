import React, { createContext, ReactNode, useContext } from "react";
import { TIMESERIES_CSV_URL } from "../constants";
import { useBlackSwans } from "../hooks/useBlackSwans";
import { useDailyCountry } from "../hooks/useDailyData-country";
import { useDailyProvince } from "../hooks/useDailyData-province";
import { useReferenceData } from "../hooks/useReferenceData";
import { useTimeSeriesData } from "../hooks/useTimeseriesData";
import { TCountryTimedata, TDailyD, TDateCount } from "../types";

type TDataContext = {
  timeseriesData: {
    countryConfirmedTimeSeries: TCountryTimedata[];
    countryDeathsTimeSeries: TCountryTimedata[];
    globalConfirmedTimeSeries: TDateCount[];
    globalDeathsTimeSeries: TDateCount[];
  };
  provinceData: { isLoading: boolean; error: string; data: TDailyD[] | null };
  countryData: { isLoading: boolean; error: string; data: TDailyD[] | null };
};

const DataContext = createContext<Partial<TDataContext>>({});

interface DataContextProviderProps {
  children: ReactNode;
}

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const [reference] = useReferenceData();
  const [
    countryConfirmedTimeSeries,
    globalConfirmedTimeSeries,
  ] = useTimeSeriesData(TIMESERIES_CSV_URL.CONFIRMED);
  const [countryDeathsTimeSeries, globalDeathsTimeSeries] = useTimeSeriesData(
    TIMESERIES_CSV_URL.DEATHS
  );
  const [, , yesterdayProvince] = useDailyProvince("10-30-2020.csv");
  const [isProvinceLoading, error, data] = useDailyProvince(
    "10-31-2020.csv",
    yesterdayProvince
  );
  const [blackSwans] = useBlackSwans(data);
  const [, yesterDayCountry] = useDailyCountry(
    yesterdayProvince,
    reference,
    blackSwans
  );
  const [isCountryLoading, coutryData] = useDailyCountry(
    data,
    reference,
    blackSwans,
    yesterDayCountry
  );
  console.log("context rendering");
  return (
    <DataContext.Provider
      value={{
        timeseriesData: {
          countryConfirmedTimeSeries,
          countryDeathsTimeSeries,
          globalConfirmedTimeSeries,
          globalDeathsTimeSeries,
        },
        provinceData: { isLoading: isProvinceLoading, error, data },
        countryData: { isLoading: isCountryLoading, error, data: coutryData },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useProvinceDataCtx = () => {
  const { provinceData } = useContext(DataContext);
  if (provinceData) {
    return provinceData;
  } else {
    throw new Error("dailyData is empty.");
  }
};

export const useCountryDataCtx = () => {
  const { countryData } = useContext(DataContext);
  if (countryData) {
    return countryData;
  } else {
    throw new Error("dailyData is empty.");
  }
};

export const useTimeSeriesDataCtx = () => {
  const { timeseriesData } = useContext(DataContext);
  if (timeseriesData) {
    return timeseriesData;
  } else {
    throw new Error("timeseriesData is empty.");
  }
};

export default DataContextProvider;
