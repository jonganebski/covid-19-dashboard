import * as d3 from "d3";
import React, { useEffect } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { INITIAL_COORDS, INITIAL_ZOOM } from "../constants";
import { useCountryDataCtx, useProvinceDataCtx } from "../contexts/dataContext";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { DailyData } from "../types";
import { TMapDataClass } from "./CenterColumn";
import LeafletCircle from "./LeafletCircle";

interface LeafletMapProps {
  dataClass: TMapDataClass;
}

// ------------- SUB FUNCTIONS -------------

const getMax = (data: DailyData[] | null, dataClass: TMapDataClass) => {
  if (data) {
    return dataClass === "confirmed"
      ? d3.max(data, (D) => D.confirmed ?? 0) ?? 0
      : dataClass === "deaths"
      ? d3.max(data, (D) => D.deaths ?? 0) ?? 0
      : dataClass === "active"
      ? d3.max(data, (D) => D.active ?? 0) ?? 0
      : d3.max(data, (D) => D.newCases ?? 0) ?? 0;
  } else {
    return 0;
  }
};

const pickCircleColor = (dataClass: TMapDataClass) => {
  return dataClass === "confirmed"
    ? "red"
    : dataClass === "active"
    ? "orange"
    : dataClass === "deaths"
    ? "whitesmoke"
    : dataClass === "newCases"
    ? "deeppink"
    : "none";
};

// ------------- COMPONENT -------------

const LeafletMap: React.FC<LeafletMapProps> = ({ dataClass }) => {
  const { selectedCountry, setSelectedCountry } = useSelectCountryCtx();
  const { data: provinceData } = useProvinceDataCtx();
  const { data: countryData } = useCountryDataCtx();
  const map = useMap();

  // Function that gets the radius.
  const getRadius = d3
    .scaleSqrt()
    .domain([0, getMax(provinceData, dataClass)])
    .range([0, 430000]);

  useEffect(() => {
    if (!selectedCountry) {
      map.setView({ lat: 20, lng: 10 }, 2);
    } else {
      const countryD = countryData?.find((D) => D.country === selectedCountry);
      const lat = countryD?.lat;
      const lng = countryD?.lon;
      const zoom = selectedCountry === "Russia" ? 3 : 4;
      if (lat && lng) {
        map.flyTo({ lat, lng }, zoom);
      } else {
        map.flyTo(INITIAL_COORDS, INITIAL_ZOOM);
      }
    }
    // eslint-disable-next-line
  }, [selectedCountry]);

  return (
    <>
      <TileLayer
        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={8}
        minZoom={2}
      />
      {provinceData
        ?.slice()
        .sort((a, b) => b[dataClass]! - a[dataClass]!)
        .map((d, i) => {
          const radius = getRadius(d[dataClass] ?? 0);
          return (
            <LeafletCircle
              key={i}
              d={d}
              radius={radius && radius > 0 ? radius : 0}
              isSelected={selectedCountry === d.country}
              selected={selectedCountry}
              setSelected={setSelectedCountry}
              dataClass={dataClass}
              color={pickCircleColor(dataClass)}
            />
          );
        })}
    </>
  );
};

export default LeafletMap;
