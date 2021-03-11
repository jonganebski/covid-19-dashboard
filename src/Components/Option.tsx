import React from "react";

interface IOptionProps {
  value: string;
  text: string;
}

const Option: React.FC<IOptionProps> = ({ value, text }) => (
  <option style={{ backgroundColor: "black" }} value={value}>
    {text}
  </option>
);

export default Option;
