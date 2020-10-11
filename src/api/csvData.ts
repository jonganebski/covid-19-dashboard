import axios from "axios";
import { TDailyD } from "../types";
import { getDailyData } from "./dailyData";
import { getTimeSeriesData } from "./timeData";

// -----------  CONSTANTS  -----------

const DAILY_BASE_URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";
const TIMESERIES_CSV_URL = {
  CONFIRMED:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  DEATHS:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
};

// -----------  SUB FUNCTIONS  -----------

const getFileNames = () => {
  const today = new Date();
  let files: string[] = [];
  for (let i = 0; i < 7; i++) {
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    const fileName = `${month}-${date}-${year}.csv`;
    files.push(fileName);
    today.setDate(today.getDate() - 1);
  }
  return files;
};

const getTargetUrls = async (files: string[]) => {
  let targets: string[] = [];
  let success = 0;
  for (const file of files) {
    try {
      const url = DAILY_BASE_URL + file;
      const res = await axios.get(url);
      const status = res.status;
      console.log(res);
      if (status === 200) {
        targets.push(url);
        success++;
      }
      if (status !== 200 && success !== 0) {
        success = 3;
      }
    } catch {}
    if (success === 3) {
      break;
    }
  }
  return targets;
};

const computeNewCasesCountry = (
  todayData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  },
  yesterdayData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  },
  twoDaysBeforeData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  }
) => {
  todayData?.countryWise?.forEach((D) => {
    const country = D.country;
    const yesterdayConfirmed = yesterdayData?.countryWise?.find(
      (d) => d.country === country
    )?.confirmed;
    const twoDaysBeforeConfirmed = twoDaysBeforeData?.countryWise?.find(
      (d) => d.country === country
    )?.confirmed;
    if (yesterdayConfirmed && twoDaysBeforeConfirmed) {
      D.newCases = yesterdayConfirmed - twoDaysBeforeConfirmed;
    }
  });
};

const computeNewCasesProvince = (
  todayData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  },
  yesterdayData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  },
  twoDaysBeforeData: {
    countryWise: TDailyD[] | null;
    provinceWise: TDailyD[];
  }
) => {
  todayData?.provinceWise?.forEach((D) => {
    const key = D.combinedKey;
    const yesterday = yesterdayData?.provinceWise?.find(
      (d) => d.combinedKey === key
    );
    const yesterdayConfirmed = yesterday?.confirmed;
    const yesterdayDate = yesterday?.lastUpdate;
    const twoDaysBeforeConfirmed = twoDaysBeforeData?.provinceWise?.find(
      (d) => d.combinedKey === key
    )?.confirmed;

    if (yesterdayConfirmed && twoDaysBeforeConfirmed) {
      D.newCases = yesterdayConfirmed - twoDaysBeforeConfirmed;
    }
    D.newCasesLastUpdate = yesterdayDate ?? "";
  });
};

// -----------  MAIN FUNCTION  -----------

const csvApi = async () => {
  const files = getFileNames();
  const targetUrls = await getTargetUrls(files);
  const [
    confirmed,
    deaths,
    todayData,
    yesterdayData,
    twoDaysBeforeData,
  ] = await Promise.all([
    getTimeSeriesData(TIMESERIES_CSV_URL.CONFIRMED),
    getTimeSeriesData(TIMESERIES_CSV_URL.DEATHS),
    getDailyData(targetUrls[0]),
    getDailyData(targetUrls[1]),
    getDailyData(targetUrls[2]),
  ]);

  computeNewCasesCountry(todayData, yesterdayData, twoDaysBeforeData);
  computeNewCasesProvince(todayData, yesterdayData, twoDaysBeforeData);
  console.log(todayData.countryWise);

  return { confirmed, deaths, todayData };
};

export default csvApi;
