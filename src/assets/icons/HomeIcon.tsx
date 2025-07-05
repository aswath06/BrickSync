import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Homeicon({ color = 'grey', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H16C15.45 21 15 20.55 15 20V16C15 15.45 14.55 15 14 15H10C9.45 15 9 15.45 9 16V20C9 20.55 8.55 21 8 21H4C3.45 21 3 20.55 3 20V10Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
