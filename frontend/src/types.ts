export type TDateCount = {
  date: number;
  count: number;
};

export type TCountryTimedata = {
  country: string;
  data: TDateCount[];
};

export interface ITimeDataState {
  confirmed: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
  deaths: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
  recovered: { countries: TTimeseriesD[] | null; global: TDateCount[] | null };
}

export type TTimeseriesD = {
  country: string;
  data: TDateCount[];
};

export type TListD = {
  country: string;
  count: number | null;
};

export type TDailyD = {
  country: string;
  admin2: string;
  combinedKey: string;
  FIPS: string;
  lastUpdate: string;
  newCasesLastUpdate: string;
  active: number | null;
  confirmed: number | null;
  deaths: number | null;
  recovered: number | null;
  newCases: number | null;
  lat: number | null;
  lon: number | null;
  province: string;
  caseFatalityRatio: number | null;
  incidenceRate: number | null;
};

export type TReferenceD = {
  country: string;
  province: string;
  admin2: string;
  lat: number | null;
  lon: number | null;
  population: number | null;
  UID: number | null;
  iso2: string;
};

export type TNewsData = {
  title: string;
  source: string;
  date: string;
  link: string
}