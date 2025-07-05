// assets/icons/ClockIcon.tsx
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function ClockIcon({ color = 'grey', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M12 6V12L16 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
