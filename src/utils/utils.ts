import { TDailyD } from "../types";

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
