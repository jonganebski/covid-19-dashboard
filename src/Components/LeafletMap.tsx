import { useTheme } from "@chakra-ui/core";
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

const initialViewport = {
  lat: 20,
  lng: 10,
  zoom: 2,
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  countryData,
  provinceData,
  selected,
  setSelected,
  dataClass,
}) => {
  const [viewport, setViewport] = useState(initialViewport);
  const theme = useTheme();
  console.log("LeafletMap Rendering...");
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

  const getMax = (data: TDailyD[]) => {
    const max = d3.max(data, (D) => D.confirmed ?? 0);
    if (max) {
      return max;
    } else {
      throw Error("Failed to make radius of the circles.");
    }
  };

  const pickColor = () => {
    return dataClass === "confirmed"
      ? theme.colors.red[900]
      : dataClass === "active"
      ? theme.colors.green[900]
      : dataClass === "deaths"
      ? theme.colors.gray[900]
      : dataClass === "caseFatalityRatio"
      ? theme.colors.blue[900]
      : "none";
  };

  const position = { lat: viewport.lat, lng: viewport.lng };

  return (
    <Map
      center={position}
      zoom={viewport.zoom}
      style={{ width: "100%", height: "100%", fill: "black" }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {provinceData
        ?.filter((d) => d[dataClass])
        .sort((a, b) => b[dataClass]! - a[dataClass]!)
        .map((d, i) => {
          const getRadius = d3
            .scaleSqrt()
            .domain([0, getMax(provinceData)])
            .range([0, 400000]);
          const radius = getRadius(d[dataClass] ?? 0) ?? 0;
          return (
            <LeafletCircle
              key={i}
              d={d}
              radius={radius > 0 ? radius : 0}
              selected={selected}
              setSelected={setSelected}
              setViewport={setViewport}
              dataClass={dataClass}
              color={pickColor()}
            />
          );
        })}
    </Map>
  );
};

export default LeafletMap;
