// assets/icons/SettingsIcon.tsx
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function SettingsIcon({ color = 'grey', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15.5C13.93 15.5 15.5 13.93 15.5 12C15.5 10.07 13.93 8.5 12 8.5C10.07 8.5 8.5 10.07 8.5 12C8.5 13.93 10.07 15.5 12 15.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.4 15A1.65 1.65 0 0020.24 13.31L21.54 11.19C21.86 10.63 21.66 9.94 21.1 9.63L19 8.5C18.65 8.27 18.27 8.15 17.88 8.15C17.68 8.15 17.47 8.18 17.27 8.23L16.33 5.91C16.07 5.34 15.43 5 14.78 5H9.22C8.57 5 7.93 5.34 7.67 5.91L6.73 8.23C6.53 8.18 6.32 8.15 6.12 8.15C5.73 8.15 5.35 8.27 5 8.5L2.9 9.63C2.34 9.94 2.14 10.63 2.46 11.19L3.76 13.31C4.6 15 6.23 16 8 16.47V19C8 19.55 8.45 20 9 20H15C15.55 20 16 19.55 16 19V16.47C17.77 16 19.4 15 19.4 15Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
