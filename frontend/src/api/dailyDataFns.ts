import { TDailyD, TReferenceD } from "../types";

export const numOrNull = (value: string) => {
  if (value === "") {
    return null;
  }
  const converted = parseFloat(value);
  if (isNaN(converted)) {
    return null;
  }
  return converted;
};

export const sumValueOrNull = (a: number | null, b: number | null) => {
  if (a === null) {
    return b;
  } else if (b === null) {
    return a;
  } else {
    return a + b;
  }
};

export const getCoordOrNull = (
  reference: TReferenceD[],
  targetCountry: string,
  type: "lat" | "lon"
) => {
  const targetRow = reference.find(
    (d) => d.country === targetCountry && d.province === ""
  );
  if (targetRow) {
    return targetRow[type];
  } else {
    console.error("Some missing coords...");
    return null;
  }
};

export const getCountryWise = (
  provinceWise: TDailyD[] | null,
  referenceData: TReferenceD[] | null,
  blackSwans: Set<string>
) => {
  if (provinceWise === null || referenceData === null) {
    return null;
  }
  // 전체 데이터를 두 종류로 분류한다. 깔끔한 데이터 / 더러운 데이터.
  const cleanData: TDailyD[] = [];
  const dirtyData: TDailyD[] = [];
  provinceWise.forEach((d) => {
    if (blackSwans.has(d.country)) {
      dirtyData.push(d);
    } else {
      cleanData.push(d);
    }
  });
  // 지역별로 나뉜 데이터를 나라별로 묶는다. 더러운 데이터를 씻긴다.
  const washedData = Array.from(blackSwans).map((blackSwan) => {
    return dirtyData
      .filter((d) => d.country === blackSwan)
      .reduce((acc, d) => {
        acc = {
          country: d.country,
          active: sumValueOrNull(acc.active, d.active),
          confirmed: sumValueOrNull(acc.confirmed, d.confirmed),
          deaths: sumValueOrNull(acc.deaths, d.deaths),
          recovered: sumValueOrNull(acc.recovered, d.recovered),
          newCases: null,
          lastUpdate: d.lastUpdate,
          newCasesLastUpdate: "",
          lat: getCoordOrNull(referenceData, d.country, "lat"),
          lon: getCoordOrNull(referenceData, d.country, "lon"),
          FIPS: "",
          incidenceRate: null,
          caseFatalityRatio: null,
          combinedKey: "",
          admin2: "",
          province: "",
        };
        return acc;
      });
  });

  // 원래 깔끔했던 데이터와 이제 깔끔해진 데이터를 합침.
  const countryWise = cleanData.concat(washedData);

  return countryWise;
};
