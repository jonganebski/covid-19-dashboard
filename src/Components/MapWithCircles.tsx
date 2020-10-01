import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { FeatureCollection, Feature } from "geojson";
import { IndexType } from "typescript";

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
    const countriesObj = apiData.Countries.reduce(
      (acc: { [key: string]: any }, countryD: any) => {
        const countryCode = countryD.CountryCode;
        acc[countryCode] = countryD;
        return acc;
      },
      {}
    );

    const countriesWithFeature = geojsonData.features.map((feature) => {
      const countryCode = feature.properties!.iso_a2;
      return { countryCode, feature, data: countriesObj[countryCode] };
    });

    return {
      features: geojsonData.features,
      countriesWithFeature,
    };
  });
};
const svgW = 1200;
const svgH = 800;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const MapWithCircles: React.FC<MapWithCirclesProps> = () => {
  const [features, setFeatures] = useState<Array<Feature> | null>(null);
  const [data, setData] = useState<any>(null);
  const [transform, setTransform] = useState({
    x: margin.left,
    y: margin.top,
    scale: 1,
  });

  useEffect(() => {
    loadAndProcessData().then(({ features, countriesWithFeature }) => {
      setFeatures(features);
      setData(countriesWithFeature);
    });
    const g = d3.select("svg").select("g") as any;
    const zoom = d3.zoom().on("zoom", (e: any) => {
      setTransform({
        x: e.transform.x,
        y: e.transform.y,
        scale: e.transform.k,
      });
    });
    g.call(zoom);
    console.log("useEffect");
  }, []);

  const getRadius = d3.scaleSqrt().domain([0, 1000000]).range([0, 20]);

  console.log("render");

  return (
    <svg width={svgW} height={svgH}>
      <g
        transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
      >
        {pathD && <path d={pathD} fill="green" />}
        {features
          ? features.map((feature) => (
              <path
                key={feature.properties?.name}
                d={pathGenerator(feature)!}
                fill="black"
                onMouseOver={(e) => {
                  const path = e.target as SVGPathElement;
                  path.style.fill = "red";
                  const circle = document.getElementById(
                    feature.properties!.iso_a2
                  ) as any;
                  if (circle) {
                    circle.style.fill = "black";
                  }
                }}
                onMouseOut={(e) => {
                  const path = e.target as SVGPathElement;
                  path.style.fill = "black";
                }}
              />
            ))
          : null}
        {data &&
          data.map(
            (d: any) =>
              d.countryCode !== "-99" && (
                <circle
                  key={d.countryCode}
                  id={d.countryCode}
                  cx={projection(d3.geoCentroid(d.feature))![0]}
                  cy={projection(d3.geoCentroid(d.feature))![1]}
                  r={getRadius(d.data?.TotalConfirmed)}
                  fill="white"
                  opacity={0.5}
                  pointerEvents="none"
                />
              )
          )}
      </g>
    </svg>
  );
};

export default MapWithCircles;
