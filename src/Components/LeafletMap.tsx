import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { TDailyCountryD } from "../types";
import LeafletCircle from "./LeafletCircle";
import * as d3 from "d3";

interface LeafletMapProps {
  dailyData: TDailyCountryD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const initialViewport = {
  lat: 20,
  lng: 10,
  zoom: 2,
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  dailyData,
  selected,
  setSelected,
}) => {
  const [viewport, setViewport] = useState(initialViewport);
  console.log("LeafletMap Rendering...");
  useEffect(() => {
    if (!selected) {
      setViewport(initialViewport);
    } else {
      const countryD = dailyData?.find((D) => D.Country_Region === selected);
      const lat = countryD?.Lat;
      const lng = countryD?.Long_;
      const zoom = selected === "Russia" ? 3 : 4;
      if (lat && lng) {
        setViewport({ lat, lng, zoom });
      }
    }
  }, [selected, dailyData]);

  const getMax = (data: TDailyCountryD[]) => {
    const max = d3.max(data, (D) => {
      if (D.provinceData) {
        D.provinceData.forEach((d) => d.Confirmed ?? 0);
      } else {
        return D.Confirmed ?? 0;
      }
    });
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
      {dailyData
        ?.filter((D) => D.Confirmed)
        .sort((a, b) => b.Confirmed! - a.Confirmed!)
        .map((D, I) => {
          const getRadius = d3
            .scaleSqrt()
            .domain([0, getMax(dailyData)])
            .range([0, 400000]);
          if (D.provinceData) {
            return D.provinceData
              ?.filter((d) => d.Confirmed)
              .sort((a, b) => b.Confirmed! - a.Confirmed!)
              .map((d, i) => {
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
              });
          } else {
            const radius = getRadius(D.Confirmed ?? 0) ?? 0;
            return (
              <LeafletCircle
                key={I}
                d={D}
                radius={radius}
                selected={selected}
                setSelected={setSelected}
                setViewport={setViewport}
              />
            );
          }
        })}
    </Map>
  );
};

export default LeafletMap;
