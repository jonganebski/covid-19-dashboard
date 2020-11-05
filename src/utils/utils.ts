import { DAILY_BASE_URL } from "../constants";
import { TDailyD } from "../types";
import Axios from "axios";

export const getMonthName = (i: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[i];
};

export const changeBg = (selected: string, countryName: string) =>
  selected === countryName ? "black" : "none";

export const compare = (a: number | null, b: number | null) => {
  if (a && b) {
    return b - a;
  } else if (a && !b) {
    return -1;
  } else if (!a && b) {
    return 1;
  } else {
    return 0;
  }
};

export const getTotalCount = (
  data: TDailyD[] | null,
  type: "confirmed" | "active" | "deaths" | "recovered" | "newCases"
): string => {
  let count = 0;
  data?.forEach((d) => (count = count + (d[type] ?? 0)));
  return count.toLocaleString();
};

export const getCountryCount = (
  data: TDailyD[] | null,
  selectedCountry: string,
  type: "confirmed" | "active" | "deaths" | "recovered" | "newCases"
): string => {
  const countryData = data?.find((d) => d.country === selectedCountry);
  if (countryData) {
    return countryData[type]?.toLocaleString() ?? "No Data";
  }
  return "No Data";
};

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

export const getTargetUrls = async () => {
  if (process.env.NODE_ENV === "development") {
    return ["10-31-2020.csv", "10-30-2020.csv"];
  }
  const files = getFileNames();
  let targets: string[] = [];
  for (const file of files) {
    try {
      const url = DAILY_BASE_URL + file;
      const res = await Axios.get(url);
      const status = res.status;
      if (status === 200) {
        targets.push(url);
      }
      if (status !== 200 && targets.length !== 0) {
        // 2일 연속의 데이터가 아니게 되는 경우.
        throw new Error("CSV data is not provided correctly.");
      }
    } catch {
      // csv files are not found. handle this error.
    }
    if (targets.length === 2) {
      break;
    }
  }
  return targets;
};
