import React from "react";
import { Circle, Popup } from "react-leaflet";
import { TDailyD } from "../types";

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
}

class LeafletCircle extends React.Component<LCProps> {
  lat = this.props.d.Lat;
  lng = this.props.d.Long_;
  confirmed = this.props.d.Confirmed;
  countryName = this.props.d.Country_Region;
  provinceName = this.props.d.Province_State;
  admin2 = this.props.d.Admin2;
  selected = this.props.selected;
  radius = this.props.radius;

  render() {
    if (this.lat && this.lng && this.confirmed) {
      return (
        <Circle
          center={{ lat: this.lat, lng: this.lng }}
          radius={this.radius}
          stroke={false}
          fillColor="tomato"
          fillOpacity={
            this.selected && this.selected === this.countryName
              ? 0.8
              : !this.selected
              ? 0.6
              : 0.2
          }
          onClick={() => this.props.setSelected(this.countryName)}
        >
          <Popup>
            {this.admin2 ? this.admin2 + ", " : ""}
            {this.provinceName ? this.provinceName + ", " : ""}
            {this.countryName}: {this.confirmed.toLocaleString()} cases.
          </Popup>
        </Circle>
      );
    } else {
      return null;
    }
  }
}

export default LeafletCircle;
