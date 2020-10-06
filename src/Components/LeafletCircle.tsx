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
    this.props.selected && this.props.selected === this.props.d.Country_Region
      ? 0.7
      : !this.props.selected
      ? 0.6
      : 0.1;

  render() {
    if (this.props.d.Lat && this.props.d.Long_ && this.props.d.Confirmed) {
      return (
        <Circle
          center={{ lat: this.props.d.Lat, lng: this.props.d.Long_ }}
          radius={this.props.radius}
          stroke={false}
          fillColor={this.props.color}
          fillOpacity={this.pickOpacity()}
          onClick={() => this.props.setSelected(this.props.d.Country_Region)}
        >
          <Popup>
            {this.props.d.Admin2 ? this.props.d.Admin2 + ", " : ""}
            {this.props.d.Province_State
              ? this.props.d.Province_State + ", "
              : ""}
            {this.props.d.Country_Region}:{" "}
            {this.props.d.Confirmed.toLocaleString()} cases.
          </Popup>
        </Circle>
      );
    } else {
      return null;
    }
  }
}

export default LeafletCircle;
