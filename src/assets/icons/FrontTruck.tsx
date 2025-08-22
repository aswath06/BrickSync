// FrontTruck.js
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const FrontTruck = ({
  width = 20,
  height = 20,
  color = "#fff",
  ...props
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M4 6L2 7M10 6h4M22 7l-2-1M18 3H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2zM4 11h16M8 15h.01M16 15h.01M6 19v2M18 21v-2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
