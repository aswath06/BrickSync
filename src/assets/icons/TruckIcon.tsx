import * as React from "react";
import Svg, { Path } from "react-native-svg";

type TruckIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const TruckIcon: React.FC<TruckIconProps> = ({
  width = 24,
  height = 24,
  color = "#000",
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M5.5 14a2.5 2.5 0 012.45 2H15V6H4a2 2 0 00-2 2v8h1.05a2.5 2.5 0 012.45-2zm0 5a2.5 2.5 0 01-2.45-2H1V8a3 3 0 013-3h11a1 1 0 011 1v2h3l3 4v5h-2.05a2.5 2.5 0 01-4.9 0h-7.1a2.5 2.5 0 01-2.45 2zm0-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm12-1a2.5 2.5 0 012.45 2H21v-3.68l-.24-.32H16v2.5c.42-.31.94-.5 1.5-.5zm0 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM16 9v2h4l-1.5-2H16z"
        fill={color}
      />
    </Svg>
  );
};

