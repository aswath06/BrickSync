// src/assets/icons/SearchIcon.tsx
import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SearchIcon = ({width = 20, height = 20, color = '#000'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M11 2a9 9 0 015.92 15.49l4.3 4.3-1.42 1.42-4.3-4.3A9 9 0 1111 2zm0 2a7 7 0 100 14 7 7 0 000-14z"
    />
  </Svg>
);
