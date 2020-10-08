import * as d3 from "d3";
import { TDailyD, TReferenceD } from "../types";

// ------------- SUB FUNCTION -------------

const numOrNull = (value: string | undefined) => (value ? +value : null);

const sumValueOrNull = (a: number | null, b: number | null) => {
  if (a === null) {
    return b;
  } else if (b === null) {
    return a;
  } else {
    return a + b;
  }
};

const getCoordOrNull = (
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

const getCountryWise = (
  provinceWise: TDailyD[],
  referenceData: TReferenceD[],
  blackSwans: Set<string>
) => {
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
  const washedData = Array.from(blackSwans).map((countryName) => {
    return dirtyData
      .filter((d) => d.country === countryName)
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

// ------------- MAIN FUNCTION -------------

export const getDailyData = async (filename: string) => {
  // 참고: 이 데이터는 리스트(new cases 제외)와 지도에 사용된다.
  //      리스트에서는 나라별로 정리된 데이터가 필요하고, 지도에서는 지역별로 정리된(원본) 데이터가 필요하다.

  const loadedData = await d3.csv(filename);

  // 각 지역 좌표만 있고 나라의 좌표가 없는 경우 좌표를 붙여주기 위한 csv 파일이다.
  const lookUpTable = await d3.csv("UID_ISO_FIPS_LookUp_Table.csv");

  // 지역별 데이터만 있는 나라들의 리스트. 중복 제거를 위해 set 사용.
  const blackSwans: Set<string> = new Set();

  // 큰 변화는 없다. 타입을 입히기 위한 작업이다.
  const referenceData: TReferenceD[] = lookUpTable.map((d) => {
    const country = d.Country_Region ?? "";
    const province = d.Province_State ?? "";
    const admin2 = d.Admin2 ?? "";
    const iso2 = d.iso2 ?? "";
    const lat = numOrNull(d.Lat);
    const lon = numOrNull(d.Long_);
    const population = numOrNull(d.Population);
    const UID = numOrNull(d.UID);
    return {
      country,
      province,
      admin2,
      iso2,
      lat,
      lon,
      population,
      UID,
    };
  });

  // 타입을 입히기 위한 작업을 하면서 지역별로만 정리된 나라들의 이름을 적어둔다.
  const provinceWise: TDailyD[] = loadedData.map((d, i, arr) => {
    if (0 < i && d.Country_Region === arr[i - 1].Country_Region) {
      blackSwans.add(d.Country_Region ?? "");
    }
    return {
      country: d.Country_Region ?? "",
      lastUpdate: d.Last_Update ?? "",
      newCasesLastUpdate: "",
      admin2: d.Admin2 ?? "",
      combinedKey: d.Combined_Key ?? "",
      FIPS: d.FIPS ?? "",
      province: d.Province_State ?? "",
      active: numOrNull(d.Active),
      confirmed: numOrNull(d.Confirmed),
      deaths: numOrNull(d.Deaths),
      recovered: numOrNull(d.Recovered),
      newCases: null,
      lat: numOrNull(d.Lat),
      lon: numOrNull(d.Long_),
      caseFatalityRatio: numOrNull(d["Case-Fatality_Ratio"]),
      incidenceRate: numOrNull(d.Incident_Rate),
    };
  });

  // 나라별로 정리된 데이터
  const countryWise = getCountryWise(provinceWise, referenceData, blackSwans);

  return { countryWise, provinceWise };
};
