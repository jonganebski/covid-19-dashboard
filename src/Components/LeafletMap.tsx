import React, { useEffect, useState } from "react";
import { Circle, Map, Popup, TileLayer } from "react-leaflet";
import { TDailyCountryD } from "../types";

interface LeafletMapProps {
  dailyData: TDailyCountryD[] | null;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  dailyData,
  selected,
  setSelected,
}) => {
  const [viewport, setViewport] = useState({
    lat: 20,
    lng: 10,
    zoom: 2,
  });

  useEffect(() => {
    if (selected) {
      const lat =
        dailyData?.filter((d) => d.Country_Region === selected)[0].Lat ?? 20;
      const lon =
        dailyData?.filter((d) => d.Country_Region === selected)[0].Long_ ?? 10;
      setViewport({ lat, lng: lon, zoom: 5 });
    } else {
      setViewport({ lat: 20, lng: 10, zoom: 2 });
    }
  }, [selected, dailyData]);

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
      {dailyData?.map((D) => {
        return D.provinceData?.map(
          (d, i) =>
            d.Confirmed &&
            d.Lat &&
            d.Long_ && (
              <Circle
                center={{ lat: d.Lat, lng: d.Long_ }}
                radius={d.Confirmed}
                stroke={false}
                fillColor="tomato"
                fillOpacity={
                  selected && selected === d.Country_Region
                    ? 0.8
                    : !selected
                    ? 0.6
                    : 0.2
                }
              >
                <Popup>
                  {d.Country_Region}
                  {d.Province_State ? ", " + d.Province_State : ""}:{" "}
                  {d.Confirmed.toLocaleString()} cases.
                </Popup>
              </Circle>
            )
        );
      })}
    </Map>
  );
};

export default LeafletMap;
