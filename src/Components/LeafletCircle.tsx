import { Heading, Text } from "@chakra-ui/core";
import { LeafletMouseEvent } from "leaflet";
import React from "react";
import { Circle, Tooltip } from "react-leaflet";
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

// ------------- COMPONENT -------------

class LeafletCircle extends React.Component<LCProps> {
  fillOpacity = { clicked: 0.1, notClicked: 0.1, normal: 0.1 };
  opacity = { clicked: 0.8, notClicked: 0.1, normal: 0.7 };

  pickFillOpacity = () =>
    this.props.selected
      ? this.props.selected === this.props.d.country
        ? this.fillOpacity.clicked
        : this.fillOpacity.notClicked
      : this.fillOpacity.normal;

  pickOpacity = () =>
    this.props.selected
      ? this.props.selected === this.props.d.country
        ? this.opacity.clicked
        : this.opacity.notClicked
      : this.opacity.normal;

  handleMouseOverOut = (e: LeafletMouseEvent) => {
    if (e.type !== "mouseover" && e.type !== "mouseout") {
      return;
    }
    e.type === "mouseover" && e.sourceTarget.setStyle({ fillOpacity: 0.5 });
    e.type === "mouseout" &&
      e.sourceTarget.setStyle({ fillOpacity: this.fillOpacity.normal });
  };

  render() {
    if (this.props.d.lat && this.props.d.lon && this.props.d.confirmed) {
      return (
        <Circle
          center={{ lat: this.props.d.lat, lng: this.props.d.lon }}
          radius={this.props.radius}
          stroke={true}
          color={this.props.color}
          opacity={this.pickOpacity()}
          weight={1}
          fillOpacity={this.pickFillOpacity()}
          onmousedown={() => this.props.setSelected(this.props.d.country)}
          onmouseover={this.handleMouseOverOut}
          onmouseout={this.handleMouseOverOut}
        >
          <Tooltip
            className="meow"
            sticky={true}
            direction="left"
            offset={[-2, 0]}
          >
            <Heading size="sm" color="gray.200">
              {this.props.d.admin2 ? this.props.d.admin2 + "," : ""}{" "}
              {this.props.d.province ? this.props.d.province + "," : ""}{" "}
              {this.props.d.country}
            </Heading>
            <Text
              color="red.500"
              opacity={this.props.dataClass === "confirmed" ? 1 : 0.5}
              fontSize={this.props.dataClass === "confirmed" ? "sm" : "xs"}
            >
              Total Cases: {this.props.d.confirmed.toLocaleString()}
            </Text>

            <Text
              color="gray.300"
              opacity={this.props.dataClass === "deaths" ? 1 : 0.5}
              fontSize={this.props.dataClass === "deaths" ? "sm" : "xs"}
            >
              Total Deaths: {this.props.d.deaths?.toLocaleString()}
            </Text>
            <Text
              color="orange.300"
              opacity={this.props.dataClass === "active" ? 1 : 0.5}
              fontSize={this.props.dataClass === "active" ? "sm" : "xs"}
            >
              Active cases: {this.props.d.active?.toLocaleString()}
            </Text>
            <Text
              color="pink.300"
              opacity={this.props.dataClass === "newCases" ? 1 : 0.5}
              fontSize={this.props.dataClass === "newCases" ? "sm" : "xs"}
            >
              New Cases: {this.props.d.newCases?.toLocaleString()}
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
