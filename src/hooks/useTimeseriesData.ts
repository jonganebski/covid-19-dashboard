import * as d3 from "d3";
import { useEffect, useState } from "react";
import { TCountryTimedata, TDateCount } from "../types";

const sumDateCount = (data: TDateCount[], date: number, count: number) => {
  const dateData = data.find((d) => d.date === date);
  if (dateData) {
    dateData.count = dateData.count + count;
  } else {
    data.push({ date, count });
  }
};

export const useTimeSeriesData = (
  fileName: string
): [TCountryTimedata[], TDateCount[]] => {
  const [countriesData, setCountriesData] = useState<TCountryTimedata[]>([]);
  const [globalData, setGlobalData] = useState<TDateCount[]>([]);

  useEffect(() => {
    d3.csv(fileName).then((loadedData) => {
      // 1. 지역별로 나눠져 있는 데이터는 한 나라의 데이터로 합친다.
      // 2. 그러면서 모든 날짜의 데이터를 수집하여 글로벌 단위의 데이터를 만든다.
      const reduced = loadedData.reduce(
        (acc, D) => {
          let country: TCountryTimedata = { country: "", data: [] };

          const { countries, global } = acc;
          const prevCountry = countries[countries.length - 1]?.country ?? "";
          const currCountry = D["Country/Region"] ?? "";
          const prevCountryData = countries[countries.length - 1]?.data ?? [];
          const arrayedObj = Object.entries(D);

          if (prevCountry !== currCountry) {
            // 이미 나라별로 정리가 된 경우.
            arrayedObj.forEach(([key, value]) => {
              const dateObj = new Date(key);
              const date = dateObj.getTime();
              const count = value ? parseInt(value) : 0;
              if (!isNaN(date)) {
                // countries
                country.country = currCountry;
                country.data.push({ date, count });
                // global
                sumDateCount(global, date, count);
              }
            });
            countries.push(country);
          } else {
            // 나라는 같은데 지역별로 나뉜 경우.
            arrayedObj.forEach(([key, value]) => {
              const dateObj = new Date(key);
              const date = dateObj.getTime();
              const count = value ? parseInt(value) : 0;
              if (!isNaN(date)) {
                // countries
                sumDateCount(prevCountryData, date, count);
                // global
                sumDateCount(global, date, count);
              }
            });
          }
          return acc;
        },
        {
          countries: [] as TCountryTimedata[],
          global: [] as TDateCount[],
        }
      );
      setCountriesData(reduced.countries);
      setGlobalData(reduced.global);
    });
  }, [fileName]);

  return [countriesData, globalData];
};
