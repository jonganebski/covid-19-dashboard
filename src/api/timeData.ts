import * as d3 from "d3";
import { TDateCount } from "../types";

export const getTimeSeriesData = async (fileName: string) => {
  // 참고: 이 시간대별 데이터는 그래프를 만들 때 주로 소비된다. 따라서 만약 값이 없는 데이터가 있다면 null이 아니라 0으로 처리한다.

  const loadedData = await d3.csv(fileName);

  // 가공하여 최종적으로 출력할 두 배열이다.
  let globalTimeData: TDateCount[] = [];
  const countryTimeData: {
    country: string;
    data: TDateCount[];
  }[] = [];

  // 나라명을 비롯한 다른 정보들이 날짜-숫자 데이터와 혼재되어 있어서 이를 구별한다.
  const reorderedData = loadedData.map((d) => {
    let country = "";
    let timeData: TDateCount[] = [];
    Object.entries(d).forEach(([key, value]) => {
      const dateObj = new Date(key);
      const date = dateObj.getTime();
      if (!isNaN(date)) {
        timeData.push({
          date,
          count: value ? parseInt(value, 10) : 0,
        });
      }
      if (key === "Country/Region") {
        country = value ?? "";
      }
    });
    return { country, data: [...timeData] };
  });

  // 더미데이터. 아래 reduce에서 마지막 나라인 짐바브웨까지 accumulator로 읽기 위함이다.
  reorderedData.push({ country: "", data: [] });

  // 지역별로 나눠서 보고하는 나라가 있기 때문에 이를 합친다.
  reorderedData.reduce((acc, d) => {
    if (acc.country === d.country) {
      d.data.forEach((d, i) => {
        acc.data[i].count = (acc.data[i].count ?? 0) + (d.count ?? 0);
      });
    } else {
      countryTimeData.push(acc);
      acc = d;
    }
    return acc;
  }, reorderedData[0]);

  // 모두 합쳐서 전세계 날짜별 데이터를 만든다.
  globalTimeData = reorderedData.reduce((acc, d) => {
    d.data.forEach((d, i) => {
      acc.data[i].count = (acc.data[i].count ?? 0) + (d.count ?? 0);
    });
    return acc;
  }, reorderedData[0]).data;

  return { countryTimeData, globalTimeData };
};
