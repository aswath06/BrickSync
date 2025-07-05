import * as React from "react";
import Svg, { G, Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface BagIconProps {
  width?: number;
  height?: number;
  color?: string; // Not used directly, as gradient is applied
}

export const BagIcon: React.FC<BagIconProps> = ({ width = 56, height = 55 }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 56 55"
      fill="none"
    >
      <G>
        <Rect
          x={4}
          width={48}
          height={47}
          rx={23.5}
          fill="url(#paint0_linear_1024_237)"
        />
        <Path
          d="M20.5 10.5l-3.75 5V33a2.5 2.5 0 002.5 2.5h17.5a2.5 2.5 0 002.5-2.5V15.5l-3.75-5h-15z"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16.75 15.5h22.5"
          stroke="#FFF5F5"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M33 20.5a5 5 0 11-10 0"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1024_237"
          x1={28}
          y1={47}
          x2={28}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E8F1FD" />
          <Stop offset={0.0001} stopColor="#1577EA" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

