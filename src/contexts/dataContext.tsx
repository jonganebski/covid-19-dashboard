import React, { createContext, ReactNode, useContext } from "react";
import { TIMESERIES_CSV_URL } from "../constants";
import { useBlackSwans } from "../hooks/useBlackSwans";
import { useDailyCountry } from "../hooks/useDailyData-country";
import { useDailyProvince } from "../hooks/useDailyData-province";
import { useRate } from "../hooks/useRate";
import { useReferenceData } from "../hooks/useReferenceData";
import { useTargetUrls } from "../hooks/useTargetUrls";
import { useTimeSeriesData } from "../hooks/useTimeseriesData";
import { TCountryTimedata, TDailyD, TDateCount, TRate } from "../types";

type TDataContext = {
  timeseriesData: {
    countryConfirmedTimeSeries: TCountryTimedata[] | null;
    countryDeathsTimeSeries: TCountryTimedata[] | null;
    globalConfirmedTimeSeries: TDateCount[] | null;
    globalDeathsTimeSeries: TDateCount[] | null;
  };
  provinceData: { isLoading: boolean; error: string; data: TDailyD[] | null };
  countryData: { isLoading: boolean; error: string; data: TDailyD[] | null };
  rateData: { newCasesPer100kWeek: TRate[] | null };
};

const DataContext = createContext<Partial<TDataContext>>({});

interface DataContextProviderProps {
  children: ReactNode;
}

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const [mostRecent, oneDayBefore] = useTargetUrls();
  const [reference] = useReferenceData();
  const [
    countryConfirmedTimeSeries,
    globalConfirmedTimeSeries,
  ] = useTimeSeriesData(TIMESERIES_CSV_URL.CONFIRMED);
  const [countryDeathsTimeSeries, globalDeathsTimeSeries] = useTimeSeriesData(
    TIMESERIES_CSV_URL.DEATHS
  );
  const [newCasesPer100kWeek] = useRate(reference, countryConfirmedTimeSeries);
  const [, , yesterdayProvince] = useDailyProvince(oneDayBefore);
  const [isProvinceLoading, error, data] = useDailyProvince(
    mostRecent,
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
    yesterDayCountry,
    newCasesPer100kWeek
  );

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
        rateData: { newCasesPer100kWeek },
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
