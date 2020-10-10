import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { TDailyD } from "../types";
import { TMapDataClass } from "./CenterColumn";
import LeafletCircle from "./LeafletCircle";

interface LeafletMapProps {
  countryData: TDailyD[] | null;
  provinceData: TDailyD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  dataClass: TMapDataClass;
}

// ------------- CONSTANT -------------

const initialViewport = {
  lat: 20,
  lng: 10,
  zoom: 2,
};

// ------------- FUNCTION -------------

const getMax = (data: TDailyD[] | null, dataClass: TMapDataClass) => {
  // confirmed, active, deaths 의 반지름은 confirmed 수를 기준으로 정해져야 한다.
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

const pickColor = (dataClass: TMapDataClass) => {
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

// ------------- SUB FUNCTION -------------

const LeafletMap: React.FC<LeafletMapProps> = ({
  countryData,
  provinceData,
  selected,
  setSelected,
  dataClass,
}) => {
  const [viewport, setViewport] = useState(initialViewport);

  useEffect(() => {
    if (!selected) {
      setViewport(initialViewport);
    } else {
      const countryD = countryData?.find((D) => D.country === selected);
      const lat = countryD?.lat;
      const lng = countryD?.lon;
      const zoom = selected === "Russia" ? 3 : 4;
      if (lat && lng) {
        setViewport({ lat, lng, zoom });
      }
    }
  }, [selected, countryData]);

  const getRadius = d3
    .scaleSqrt()
    .domain([0, getMax(provinceData, dataClass)])
    .range([0, 430000]);

  return (
    <Map
      center={{ lat: viewport.lat, lng: viewport.lng }}
      zoom={viewport.zoom}
      style={{ width: "100%", height: "100%", fill: "black" }}
    >
      <TileLayer
        // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={8}
        minZoom={2}
      />
      {provinceData
        ?.filter((d) => d[dataClass])
        .sort((a, b) => b[dataClass]! - a[dataClass]!)
        .map((d, i) => {
          const radius = getRadius(d[dataClass] ?? 0);
          return (
            <LeafletCircle
              key={i}
              d={d}
              radius={radius && radius > 0 ? radius : 0}
              selected={selected}
              setSelected={setSelected}
              setViewport={setViewport}
              dataClass={dataClass}
              color={pickColor(dataClass)}
            />
          );
        })}
    </Map>
  );
};

export default LeafletMap;