import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { TDailyD } from "../types";
import LeafletCircle from "./LeafletCircle";
import * as d3 from "d3";

interface LeafletMapProps {
  provinceData: TDailyD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const initialViewport = {
  lat: 20,
  lng: 10,
  zoom: 2,
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  provinceData,
  selected,
  setSelected,
}) => {
  const [viewport, setViewport] = useState(initialViewport);
  console.log("LeafletMap Rendering...");
  useEffect(() => {
    if (!selected) {
      setViewport(initialViewport);
    } else {
      const countryD = provinceData?.find((D) => D.Country_Region === selected);
      const lat = countryD?.Lat;
      const lng = countryD?.Long_;
      const zoom = selected === "Russia" ? 3 : 4;
      if (lat && lng) {
        setViewport({ lat, lng, zoom });
      }
    }
  }, [selected, provinceData]);

  const getMax = (data: TDailyD[]) => {
    const max = d3.max(data, (D) => D.Confirmed ?? 0);
    if (max) {
      return max;
    } else {
      throw Error("Failed to make radius of the circles.");
    }
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
        ?.filter((d) => d.Confirmed)
        .sort((a, b) => b.Confirmed! - a.Confirmed!)
        .map((d, i) => {
          const getRadius = d3
            .scaleSqrt()
            .domain([0, getMax(provinceData)])
            .range([0, 400000]);
          const radius = getRadius(d.Confirmed ?? 0) ?? 0;
          return (
            <LeafletCircle
              key={i}
              d={d}
              radius={radius}
              selected={selected}
              setSelected={setSelected}
              setViewport={setViewport}
            />
          );
        })}
    </Map>
  );
};

export default LeafletMap;
