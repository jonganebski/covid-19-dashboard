export type TDateCount = {
  date: number;
  count: number;
};

export type TTimeseriesD = {
  country: string;
  data: TDateCount[];
};

export type TDailyD = {
  Country_Region: string;
  Admin2: string;
  Combined_Key: string;
  FIPS: string;
  Last_Update: string;
  Active: number | null;
  Confirmed: number | null;
  Deaths: number | null;
  Recovered: number | null;
  Lat: number | null;
  Province_State: string;
  Long_: number | null;
  CaseFatality_Ratio: number | null;
  Incidence_Rate: number | null;
};

export type TReferenceD = {
  Country_Region: string;
  Province_State: string;
  Admin2: string;
  Lat: number | null;
  Long_: number | null;
  Population: number | null;
  UID: number | null;
  iso2: string;
};
