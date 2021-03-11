import { Heading, Text } from "@chakra-ui/react";
import { LeafletEventHandlerFnMap, PathOptions } from "leaflet";
import React from "react";
import { Circle, Tooltip } from "react-leaflet";
import { DailyData } from "../types";
import { TMapDataClass } from "./CenterColumn";

interface LCProps {
  d: DailyData;
  radius: number;
  isSelected: boolean;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  dataClass: TMapDataClass;
  color: string;
}

// ------------- COMPONENT -------------
const FILL_OPACITY = { clicked: 0.1, notClicked: 0.1, normal: 0.1 };
const OPACITY = { clicked: 0.8, notClicked: 0.1, normal: 0.7 };

const LeafletCircle: React.FC<LCProps> = ({
  color,
  d,
  dataClass,
  radius,
  selected,
  setSelected,
}) => {
  const pathOptions: PathOptions = {
    opacity: !selected
      ? OPACITY.normal
      : selected === d.country
      ? OPACITY.clicked
      : OPACITY.notClicked,
    fillOpacity: !selected
      ? FILL_OPACITY.normal
      : selected === d.country
      ? FILL_OPACITY.clicked
      : FILL_OPACITY.notClicked,
    color,
  };

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: () => setSelected(d.country),
    mouseover: (e) => e.sourceTarget.setStyle({ fillOpacity: 0.5 }),
    mouseout: (e) =>
      e.sourceTarget.setStyle({ fillOpacity: FILL_OPACITY.normal }),
  };

  if (d.lat && d.lon && d.confirmed) {
    return (
      <Circle
        center={{ lat: d.lat, lng: d.lon }}
        eventHandlers={eventHandlers}
        pathOptions={pathOptions}
        radius={radius}
        stroke={true}
        weight={1}
      >
        <Tooltip sticky={true} direction="left" offset={[-2, 0]}>
          <Heading size="sm" color="gray.200">
            {d.admin2 ? d.admin2 + "," : ""}{" "}
            {d.province ? d.province + "," : ""} {d.country}
          </Heading>
          <Text
            color="red.500"
            opacity={dataClass === "confirmed" ? 1 : 0.5}
            fontSize={dataClass === "confirmed" ? "sm" : "xs"}
          >
            Total Cases: {d.confirmed.toLocaleString()}
          </Text>

          <Text
            color="gray.300"
            opacity={dataClass === "deaths" ? 1 : 0.5}
            fontSize={dataClass === "deaths" ? "sm" : "xs"}
          >
            Total Deaths: {d.deaths?.toLocaleString()}
          </Text>
          <Text
            color="orange.300"
            opacity={dataClass === "active" ? 1 : 0.5}
            fontSize={dataClass === "active" ? "sm" : "xs"}
          >
            Active cases: {d.active?.toLocaleString()}
          </Text>
          <Text
            color="pink.300"
            opacity={dataClass === "newCases" ? 1 : 0.5}
            fontSize={dataClass === "newCases" ? "sm" : "xs"}
          >
            New Cases: {d.newCases?.toLocaleString()}
          </Text>
        </Tooltip>
      </Circle>
    );
  } else {
    return null;
  }
};

export default LeafletCircle;
