import React, { useState } from "react";
import { Circle, Map, Popup, TileLayer } from "react-leaflet";
import { TDailyD } from "../App";

interface LeafletMapProps {
  dailyData: {
    countryWise: TDailyD[];
    provinceWise: TDailyD[];
  } | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ dailyData }) => {
  const [viewport] = useState({
    lat: 51.505,
    lng: -0.09,
    zoom: 2,
  });

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
      {dailyData &&
        dailyData.provinceWise.map(
          (d, i) =>
            d.Lat &&
            d.Long_ && (
              <Circle
                key={i}
                center={{ lat: d.Lat, lng: d.Long_ }}
                radius={d.Confirmed}
                stroke={false}
                fillColor="tomato"
                fillOpacity={0.5}
              >
                <Popup>
                  {d.Country_Region}, {d.Province_State}: {d.Confirmed} cases.
                </Popup>
              </Circle>
            )
        )}
    </Map>
  );
};

export default LeafletMap;
