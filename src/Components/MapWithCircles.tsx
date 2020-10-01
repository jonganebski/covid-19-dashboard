import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";

interface MapWithCirclesProps {}

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const pathD = pathGenerator({ type: "Sphere" });

const loadAndProcessData = () => {
  return Promise.all<FeatureCollection, any>([
    d3.json(
      "https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m_countries.geojson"
    ),
    fetch("https://api.covid19api.com/summary").then((response) =>
      response.json()
    ),
  ]).then(([geojsonData, apiData]) => {
    console.log("geojsonData: ", geojsonData);
    console.log("apiData: ", apiData);
    return geojsonData;
  });
};

const MapWithCircles: React.FC<MapWithCirclesProps> = () => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(
    null
  );
  const svgW = 1200;
  const svgH = 800;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  useEffect(() => {
    loadAndProcessData().then((geojsonData) => setGeojsonData(geojsonData));
  }, []);

  return (
    <svg width={svgW} height={svgH}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {pathD && <path d={pathD} fill="green" />}
        {geojsonData
          ? geojsonData.features.map((feature) => (
              <path
                key={feature?.properties?.name}
                d={pathGenerator(feature)!}
                fill="black"
              />
            ))
          : null}
      </g>
    </svg>
  );
};

export default MapWithCircles;
