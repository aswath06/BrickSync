import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function DropdownIcon({ width = 24, height = 24, color = "#e3e3e3", ...props }) {
  return (
    <Svg
      viewBox="0 -960 960 960"
      width={width}
      height={height}
      fill={color}
      {...props}
    >
      <Path d="M480-360L280-560h400L480-360z" />
    </Svg>
  );
}

