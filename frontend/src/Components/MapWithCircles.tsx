import * as d3 from "d3";
import { D3ZoomEvent } from "d3";
import { geoPatterson } from "d3-geo-projection";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import React, { useEffect, useMemo, useState } from "react";

interface MapWithCirclesProps {
  data: TdataForMap;
}

type TdataForMap = Array<{
  countryCode: any;
  feature: Feature<Geometry, GeoJsonProperties>;
  data: any;
}>;

// ----------- 전역변수 -----------

// const projection = d3.geoNaturalEarth1();
const projection = geoPatterson();
const pathGenerator = d3.geoPath().projection(projection);
const pathD = pathGenerator({ type: "Sphere" });
const svgW = "100%";
const svgH = "80%";
const oceanColor = "teal";
const countryColor = "lightgray";
const countryColorOnHover = "red";
const circleColor = "black";
const circleColorOnHover = "white";

const MapWithCircles: React.FC<MapWithCirclesProps> = ({ data }) => {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  // d3.zoom()을 붙인 엘리먼트의 transfer를 건드리면 느려지고 흔들리고 문제가 많다.
  // 이에 대한 해결책은 다른 그룹을 만들어서 d3.zoom이 물려있는 그룹과 transform되는 그룹을 분리하는 것이다.
  useEffect(() => {
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
    if (data) {
      return data.map((d) => {
        return (
          <g>
            <path
              key={d.feature.properties?.name}
              d={pathGenerator(d.feature)!}
              stroke="black"
              strokeWidth={0.05}
              fill={countryColor}
              opacity={0.5}
              onMouseOver={(e) => {
                const path = e.target as SVGPathElement;
                path.style.fill = countryColorOnHover;
                if (d.feature.properties!.iso_a2 !== "-99") {
                  const circle = d3.select(`#${d.feature.properties!.iso_a2}`);
                  const tooltip = d3.select(
                    `#${d.feature.properties!.iso_a2}-tooltip`
                  );
                  circle.attr("fill", circleColorOnHover);
                  tooltip.attr("opacity", 1);
                }
              }}
              onMouseOut={(e) => {
                const path = e.target as SVGPathElement;
                path.style.fill = countryColor;
                if (d.feature.properties!.iso_a2 !== "-99") {
                  const circle = d3.select(`#${d.feature.properties!.iso_a2}`);
                  const tooltip = d3.select(
                    `#${d.feature.properties!.iso_a2}-tooltip`
                  );
                  circle.attr("fill", circleColor);
                  tooltip.attr("opacity", 0);
                }
              }}
            />
          </g>
        );
      });
    }
  }, [data]);

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
      return data.map((d: any) => {
        const radius = getRadius(d.data?.TotalConfirmed) ?? 0;

        return (
          d.countryCode !== "-99" && (
            <g
              key={d.countryCode}
              transform={`translate(${
                projection(d3.geoCentroid(d.feature))![0]
              }, ${projection(d3.geoCentroid(d.feature))![1]})`}
            >
              <circle
                id={d.countryCode}
                r={radius}
                fill={circleColor}
                opacity={0.5}
                pointerEvents="none"
              />
            </g>
          )
        );
      });
    }
  }, [data]);

  const tooltipComponents = useMemo(() => {
    if (data) {
      const getRadius = d3
        .scaleSqrt()
        .domain([0, getMax(data)])
        .range([0, 50]);
      return data.map((d: any) => {
        const radius = getRadius(d.data?.TotalConfirmed) ?? 0;

        return (
          d.countryCode !== "-99" && (
            <g
              key={d.countryCode}
              transform={`translate(${
                projection(d3.geoCentroid(d.feature))![0]
              }, ${projection(d3.geoCentroid(d.feature))![1]})`}
            >
              <g
                id={d.countryCode + "-tooltip"}
                opacity={0}
                pointerEvents="none"
                transform={`translate(${Math.max(20, radius + 10)},${Math.min(
                  -50,
                  -radius - 25
                )})`}
                style={{ boxSizing: "content-box" }}
              >
                {
                  <foreignObject style={{ overflow: "visible", zIndex: 10 }}>
                    <article
                      style={{
                        display: "inline-block",
                        minWidth: "60px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "0px 7px 0px 7px",
                        lineHeight: "20px",
                        fontSize: "15px",
                        textAlign: "center",
                        borderRadius: "5px",
                        borderBottomLeftRadius: "0px",
                      }}
                    >
                      <h6 style={{ whiteSpace: "nowrap" }}>
                        {d.data?.Country}
                      </h6>
                      <pre>{d.data?.TotalConfirmed ?? "No data"}</pre>
                    </article>
                  </foreignObject>
                }
              </g>
            </g>
          )
        );
      });
    }
  }, [data]);

  return (
    <svg width={svgW} height={svgH}>
      <g
        id="zoom-handler"
        width="100%"
        height="100%"
        transform="translate(0, 0)"
      >
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          {/* 아래의 컴포넌트들을 이렇게 useMemo로 처리해야 svg가 움직일 때 느려지지 않는다.  */}
          {earthPathComponents}
          {borderPathComponents}
          {circleComponents}
          {tooltipComponents}
        </g>
      </g>
    </svg>
  );
};

export default MapWithCircles;
