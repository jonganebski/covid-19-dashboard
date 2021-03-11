import { LatLngExpression } from "leaflet";

export const DAILY_BASE_URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

export const TIMESERIES_CSV_URL = {
  CONFIRMED:
    process.env.NODE_ENV === "development"
      ? "time_series_covid19_confirmed_global.csv"
      : "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  DEATHS:
    process.env.NODE_ENV === "development"
      ? "time_series_covid19_deaths_global.csv"
      : "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
};

export const REFERENCE_CSV_URL =
  process.env.NODE_ENV === "development"
    ? "UID_ISO_FIPS_LookUp_Table.csv"
    : "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv";

export const INITIAL_COORDS: LatLngExpression = { lat: 20, lng: 10 };
export const INITIAL_ZOOM = 2;
