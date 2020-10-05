import { Flex, Grid, Heading } from "@chakra-ui/core";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import React, { useEffect, useState } from "react";
import CenterColumn from "./Components/CenterColumn";
import LeftColumn from "./Components/LeftColumn";
import RightColumn from "./Components/RightColumn";

export interface IDateCount {
  date: number;
  count: number;
}

interface I {
  Cases: number;
  City: string;
  CityCode: string;
  Country: string;
  CountryCode: string;
  Date: string;
  Lat: string;
  Lon: string;
  Province: string;
  Status: string;
}

export type TdataForMap = Array<{
  countryCode: any;
  feature: Feature<Geometry, GeoJsonProperties>;
  data: any;
}>;

// export type TTimeseriesD = { date: number | null; count: number | null };
export type TMainD = {
  CountryRegion: string;
  ProvinceState: string;
  Lat: number | null;
  Long: number | null;
  data: IDateCount[];
};

export type TDailyD = {
  Country_Region: string;
  Last_Update: string;
  Active: number;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Lat: number;
  Long_: number;
  Admin2: string;
  CaseFatality_Ratio: number | null;
  Combined_Key: string;
  FIPS: string;
  Incidence_Rate: number | null;
  Province_State: string;
};
const COORDS: { [key: string]: { lat: number; lon: number } } = {
  Australia: { lat: -24.77612, lon: 134.754991 },
  Brazil: { lat: -10.33335, lon: -53.199991 },
  Canada: { lat: 61.066689, lon: -107.991692 },
  Chile: { lat: -31.761326, lon: -71.318776 },
  China: { lat: 35.000072, lon: 104.999934 },
  Colombia: { lat: 2.889445, lon: -73.78391 },
  Denmark: { lat: 55.670244, lon: 10.333308 },
  France: { lat: 46.603361, lon: 1.88834 },
  Germany: { lat: 51.083433, lon: 10.42343 },
  India: { lat: 22.35113, lon: 78.667762 },
  Italy: { lat: 42.63843, lon: 12.674297 },
  Japan: { lat: 36.574857, lon: 139.23943 },
  Mexico: { lat: 22.500051, lon: -100.000038 },
  Netherlands: { lat: 52.500174, lon: 5.748103 },
  Pakistan: { lat: 30.330827, lon: 71.247484 },
  Peru: { lat: -6.869955, lon: -75.045835 },
  Russia: { lat: 64.686314, lon: 97.745309 },
  Spain: { lat: 39.326218, lon: -4.838083 },
  Sweden: { lat: 59.674972, lon: 14.520859 },
  US: { lat: 39.783728, lon: -100.445886 },
  Ukraine: { lat: 49.487187, lon: 31.271836 },
  "United Kingdom": { lat: 54.70235, lon: -3.276565 },
};
const getDailyData = async (filename: string) => {
  const loadedData = await d3.csv(filename);
  // console.log("loadedData: ", loadedData);
  const mixedCountries: Set<string> = new Set();

  const provinceWise: TDailyD[] = loadedData.map((d, i, arr) => {
    if (0 < i && d.Country_Region === arr[i - 1].Country_Region) {
      mixedCountries.add(d.Country_Region ?? "");
    }
    return {
      Country_Region: d.Country_Region ?? "",
      Active: d.Active ? +d.Active : 0,
      Confirmed: d.Confirmed ? +d.Confirmed : 0,
      Deaths: d.Deaths ? +d.Deaths : 0,
      Recovered: d.Recovered ? +d.Recovered : 0,
      Lat: d.Lat ? +d.Lat : 0,
      Long_: d.Long_ ? +d.Long_ : 0,
      Last_Update: d.Last_Update ?? "",
      Admin2: d.Admin2 ?? "",
      CaseFatality_Ratio: d["Case-Fatality_Ratio"]
        ? +d["Case-Fatality_Ratio"]
        : 0,
      Combined_Key: d.Combined_Key ?? "",
      FIPS: d.FIPS ?? "",
      Incidence_Rate: d.Incident_Rate ? +d.Incident_Rate : 0,
      Province_State: d.Province_State ?? "",
    };
  });
  console.log("provinceWise: ", provinceWise);
  console.log(mixedCountries);

  const clean: TDailyD[] = [];
  const blackList: TDailyD[] = [];
  provinceWise.forEach((d) => {
    if (mixedCountries.has(d.Country_Region)) {
      blackList.push(d);
    } else {
      clean.push(d);
    }
  });

  console.log("clean: ", clean);
  console.log("blackList: ", blackList);

  const x = Array.from(mixedCountries).map((countryName) => {
    return blackList
      .filter((d) => d.Country_Region === countryName)
      .reduce((acc, d) => {
        acc = {
          Country_Region: d.Country_Region,
          Active: acc.Active + d.Active,
          Confirmed: acc.Confirmed + d.Confirmed,
          Deaths: acc.Deaths + d.Deaths,
          Recovered: acc.Recovered + d.Recovered,
          Last_Update: d.Last_Update,
          Lat: COORDS[d.Country_Region].lat,
          Long_: COORDS[d.Country_Region].lon,
          FIPS: "",
          Incidence_Rate: null,
          CaseFatality_Ratio: null,
          Combined_Key: "",
          Admin2: "",
          Province_State: "",
        };
        return acc;
      });
  });

  console.log("x: ", x);

  const countryWise = clean.concat(x);

  console.log("countryWise: ", countryWise);
  return { provinceWise, countryWise };
};

const getTimeSeriesData = async (fileName: string) => {
  const loadedData = await d3.csv(fileName);
  const D: TMainD = {
    CountryRegion: "",
    ProvinceState: "",
    Lat: 0,
    Long: 0,
    data: [],
  };
  const data = loadedData.map((d) => {
    const timeData: IDateCount[] = [];
    Object.entries(d).forEach(([key, value]) => {
      if (key === "Country/Region") {
        D.CountryRegion = value ?? "";
      } else if (key === "Province/State") {
        D.ProvinceState = value ?? "";
      } else if (key === "Lat") {
        D.Lat = value ? +value : null;
      } else if (key === "Long") {
        D.Long = value ? +value : null;
      } else {
        timeData.push({
          date: new Date(key).getTime() ?? null,
          count: value ? +value : 0,
        });
      }
    });
    return { ...D, data: [...timeData] };
  });
  const countryWise: any = [];
  data.push({
    ProvinceState: "",
    CountryRegion: "",
    Lat: null,
    Long: null,
    data: [],
  });
  data.reduce((acc, d) => {
    if (acc.CountryRegion === d.CountryRegion) {
      // console.log("same");
      acc.ProvinceState = "";
      d.data.forEach((d, i) => {
        acc.data[i].count = (acc.data[i].count ?? 0) + (d.count ?? 0);
      });
    } else {
      countryWise.push(acc);
      acc = d;
    }
    return acc;
  }, data[0]);

  // console.log("countryWise: ", countryWise);
  return countryWise;
};

const App = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TMainD[] | null>(null);
  const [dailyData, setDailyData] = useState<{
    countryWise: TDailyD[];
    provinceWise: TDailyD[];
  } | null>(null);
  const [selected, setSelected] = useState("");
  console.log("selected: ", selected);

  const handleLiClick = (countryName: string) => {
    setSelected((prev) => (prev === countryName ? "" : countryName));
  };

  const scrollList = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    if (selected) {
      const target = ref.current?.querySelector(
        `#${selected.replace(/\s+/g, "")}`
      );
      console.log(target);
      const parent = target?.parentElement;
      const parentID = parent?.id;
      const scrollHeight =
        parentID && parent?.scrollHeight
          ? (+parentID - 1) * parent.scrollHeight
          : 0;

      ref.current?.scrollTo({
        top: scrollHeight < 0 ? 0 : scrollHeight,
        behavior: "smooth",
      });
    } else {
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // console.log("timeSeriesData: ", timeSeriesData);
  useEffect(() => {
    // ----------- 데이터 로드 -----------
    getTimeSeriesData("time_series_covid19_confirmed_global.csv").then((data) =>
      setTimeSeriesData(data)
    );
    getDailyData("10-02-2020.csv").then(({ countryWise, provinceWise }) =>
      setDailyData({ countryWise, provinceWise })
    );
  }, []);

  return (
    <div
      className="App"
      style={{
        padding: "5px",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <Grid
        w="100%"
        gap={1}
        style={{
          gridTemplate: `"header header header" 5vh
                          "left center right" 94vh / 3fr 9fr 5fr`,
        }}
      >
        <Flex gridArea="header" justify="center" bg="blue.500">
          <Heading> Covid-19 Information Dashboard</Heading>
        </Flex>
        <LeftColumn
          dailyData={dailyData}
          selected={selected}
          setSelected={setSelected}
          handleLiClick={handleLiClick}
          scrollList={scrollList}
        />
        <CenterColumn dailyData={dailyData} />
        <RightColumn
          dailyData={dailyData}
          timeSeriesData={timeSeriesData}
          selected={selected}
          setSelected={setSelected}
          handleLiClick={handleLiClick}
          scrollList={scrollList}
        />
      </Grid>
    </div>
  );
};

export default App;
