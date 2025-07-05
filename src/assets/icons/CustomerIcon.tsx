// ../assets/icons/CustomerIcon.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CustomerIcon = (props:any) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z"
      fill="#1E1E1E"
    />
  </Svg>
);
