import { useEffect, useState } from "react";
import { TDailyD, TReferenceD } from "../types";

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

export const useDailyCountry = (
  provinceData: TDailyD[] | null,
  referenceData: TReferenceD[] | null,
  blackSwans: Set<string> | null,
  yesterdayData?: TDailyD[] | null
): [boolean, TDailyD[] | null] => {
  const [isLoading, setIsLoading] = useState(true);
  const [countryData, setCountryData] = useState<TDailyD[] | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const computeNewCases = (
      todayData: TDailyD[],
      yesterdayData: TDailyD[]
    ) => {
      todayData.forEach((D) => {
        const country = D.country;
        const todayConfirmed = todayData.find((d) => d.country === country)
          ?.confirmed;
        const yesterdayConfirmed = yesterdayData.find(
          (d) => d.country === country
        )?.confirmed;
        if (yesterdayConfirmed && todayConfirmed) {
          D.newCases = todayConfirmed - yesterdayConfirmed;
        }
      });
    };

    const getCountryWise = (
      provinceWise: TDailyD[] | null,
      referenceData: TReferenceD[],
      blackSwans: Set<string>
    ) => {
      // 전체 데이터를 두 종류로 분류한다. 깔끔한 데이터 / 더러운 데이터(blackSwan에 해당하는 데이터).
      const cleanData: TDailyD[] = [];
      const dirtyData: TDailyD[] = [];
      provinceWise?.forEach((d) => {
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
      if (yesterdayData) {
        computeNewCases(countryWise, yesterdayData);
      }
      setIsLoading(false);
      return countryWise;
    };
    if (provinceData && referenceData && blackSwans) {
      setCountryData(getCountryWise(provinceData, referenceData, blackSwans));
    }
  }, [blackSwans, provinceData, referenceData, yesterdayData]);

  return [isLoading, countryData];
};
