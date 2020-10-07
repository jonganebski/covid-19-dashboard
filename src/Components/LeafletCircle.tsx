import React from "react";
import { Circle, Popup } from "react-leaflet";
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
  pickOpacity = () =>
    this.props.selected && this.props.selected === this.props.d.country
      ? 0.7
      : !this.props.selected
      ? 0.6
      : 0.1;

  render() {
    if (this.props.d.lat && this.props.d.lon && this.props.d.confirmed) {
      return (
        <Circle
          center={{ lat: this.props.d.lat, lng: this.props.d.lon }}
          radius={this.props.radius}
          stroke={false}
          fillColor={this.props.color}
          fillOpacity={this.pickOpacity()}
          onClick={() => this.props.setSelected(this.props.d.country)}
        >
          <Popup>
            {this.props.d.admin2 ? this.props.d.admin2 + ", " : ""}
            {this.props.d.province ? this.props.d.province + ", " : ""}
            {this.props.d.country}: {this.props.d.confirmed.toLocaleString()}{" "}
            cases.
          </Popup>
        </Circle>
      );
    } else {
      return null;
    }
  }
}

export default LeafletCircle;
