import * as d3 from "d3";
import { D3ZoomEvent } from "d3";
import { Feature, FeatureCollection } from "geojson";
import React, { useEffect, useMemo, useState } from "react";

interface MapWithCirclesProps {}

// ----------- 전역변수 -----------

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const pathD = pathGenerator({ type: "Sphere" });
const svgW = 1200;
const svgH = 800;
const oceanColor = "steelblue";
const countryColor = "lightgray";
const countryColorOnHover = "red";
const circleColor = "black";
const circleColorOnHover = "white";

// ----------- 함수 -----------
// 데이터를 무조건 [{countryCode, countryName, feature, number}, ....] 형식으로 바꿔야 되나?
// 아니면 features를 기반으로 하고 그 안의 properties 안에 데이터를 넣어버릴까?
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

const MapWithCircles: React.FC<MapWithCirclesProps> = () => {
  const [features, setFeatures] = useState<Array<Feature> | null>(null);
  const [data, setData] = useState<any>(null);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  console.log("data: ", data);
  console.log("features: ", features);
  useEffect(() => {
    // ----------- 데이텨 로드 -----------
    loadAndProcessData().then(({ features, countriesWithFeature }) => {
      setFeatures(features);
      setData(countriesWithFeature);
    });
    // d3.zoom()을 붙인 엘리먼트의 transfer를 건드리면 느려지고 흔들리고 문제가 많다.
    // 이에 대한 해결책은 다른 그룹을 만들어서 d3.zoom이 물려있는 그룹과 transform되는 그룹을 분리하는 것이다.
    const g = d3.select("svg").select("#zoom-handler") as d3.Selection<
      Element,
      unknown,
      any,
      any
    >;
    const handleZoom = (e: D3ZoomEvent<any, any>) => {
      setTransform({
        x: e.transform.x,
        y: e.transform.y,
        scale: e.transform.k,
      });
    };
    const zoom = d3
      .zoom()
      .on("zoom", handleZoom as d3.ValueFn<Element, unknown, void>);
    g.call(zoom);
  }, []);

  const earthPathComponents = useMemo(() => {
    if (pathD) {
      return <path d={pathD} fill={oceanColor} />;
    }
  }, []);

  const borderPathComponents = useMemo(() => {
    if (features) {
      return features.map((feature) => {
        return (
          <g>
            <title>{feature.properties!.name}</title>
            <path
              key={feature.properties?.name}
              d={pathGenerator(feature)!}
              stroke="black"
              strokeWidth={0.05}
              fill={countryColor}
              opacity={0.5}
              onMouseOver={(e) => {
                const path = e.target as SVGPathElement;
                path.style.fill = countryColorOnHover;
                if (feature.properties!.iso_a2 !== "-99") {
                  const circle = d3.select(`#${feature.properties!.iso_a2}`);
                  circle.attr("fill", circleColorOnHover);
                }
              }}
              onMouseOut={(e) => {
                const path = e.target as SVGPathElement;
                path.style.fill = countryColor;
                if (feature.properties!.iso_a2 !== "-99") {
                  const circle = d3.select(`#${feature.properties!.iso_a2}`);
                  circle.attr("fill", circleColor);
                }
              }}
            />
          </g>
        );
      });
    }
  }, [features]);

  const getMax = (data: any) => {
    const max = d3.max(data, (d: any) => d.data?.TotalConfirmed);
    if (typeof max !== "number") {
      throw Error("Unable to make y scale.");
    } else {
      return max;
    }
  };

  const circleComponents = useMemo(() => {
    if (data) {
      const getRadius = d3
        .scaleSqrt()
        .domain([0, getMax(data)])
        .range([0, 50]);
      return data.map(
        (d: any) =>
          d.countryCode !== "-99" && (
            <circle
              key={d.countryCode}
              id={d.countryCode}
              cx={projection(d3.geoCentroid(d.feature))![0]}
              cy={projection(d3.geoCentroid(d.feature))![1]}
              r={getRadius(d.data?.TotalConfirmed)}
              fill={circleColor}
              opacity={0.5}
              pointerEvents="none"
            />
          )
      );
    }
  }, [data]);

  return (
    <svg width={svgW} height={svgH}>
      <g id="zoom-handler">
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          {/* 아래의 컴포넌트들을 이렇게 useMemo로 처리해야 svg가 움직일 때 느려지지 않는다.  */}
          {earthPathComponents}
          {borderPathComponents}
          {circleComponents}
        </g>
      </g>
    </svg>
  );
};

export default MapWithCircles;
