import { Box, Heading, Text } from "@chakra-ui/core";
import React from "react";
import { Circle, Popup, Marker, Tooltip } from "react-leaflet";
import { TDailyD } from "../types";
import { TMapDataClass } from "./CenterColumn";

interface LCProps {
  d: TDailyD;
  radius: number;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setViewport: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
      zoom: number;
    }>
  >;
  dataClass: TMapDataClass;
  color: string;
}

class LeafletCircle extends React.Component<LCProps> {
  pickFillOpacity = () =>
    this.props.selected && this.props.selected === this.props.d.country
      ? 0.7
      : !this.props.selected
      ? 0.1
      : 0.1;

  pickOpacity = () =>
    this.props.selected && this.props.selected === this.props.d.country
      ? 1
      : !this.props.selected
      ? 1
      : 0.7;

  render() {
    if (this.props.d.lat && this.props.d.lon && this.props.d.confirmed) {
      return (
        <Circle
          center={{ lat: this.props.d.lat, lng: this.props.d.lon }}
          radius={this.props.radius}
          stroke={true}
          color={this.props.color}
          opacity={this.pickOpacity()}
          weight={0.5}
          fillOpacity={this.pickFillOpacity()}
          onmousedown={() => this.props.setSelected(this.props.d.country)}
          onmouseover={(e) => e.sourceTarget.setStyle({ fillOpacity: 0.5 })}
          onmouseout={(e) => e.sourceTarget.setStyle({ fillOpacity: 0.1 })}
        >
          <Tooltip
            className="meow"
            sticky={true}
            direction="left"
            offset={[-2, 0]}
          >
            <Heading size="sm" color="gray.400">
              {this.props.d.admin2 ? this.props.d.admin2 + "," : ""}{" "}
              {this.props.d.province ? this.props.d.province + "," : ""}{" "}
              {this.props.d.country}
            </Heading>
            <Text color="gray.400">
              Total Cases: {this.props.d.confirmed.toLocaleString()}
            </Text>
            <Text color="gray.400">
              Total Deaths: {this.props.d.deaths?.toLocaleString()}
            </Text>
            <Text color="gray.400">
              Active cases: {this.props.d.active?.toLocaleString()}
            </Text>
            <Text color="gray.400">
              Case-Fatality Ratio: {this.props.d.caseFatalityRatio?.toFixed(3)}
            </Text>
          </Tooltip>
        </Circle>
      );
    } else {
      return null;
    }
  }
}

export default LeafletCircle;
