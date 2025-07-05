import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type FireIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const FireIcon: React.FC<FireIconProps> = ({
  width = 24,
  height = 24,
  color = '#1E1E1E',
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.001 7.001 0 01-11.95 4.95A7 7 0 015 15c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"
        stroke={color}
        strokeOpacity={0.8}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
