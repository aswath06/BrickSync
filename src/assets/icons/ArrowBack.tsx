import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ArrowBack: React.FC<SvgProps> = (props) => {
  return (
    <Svg
      height="24px"
      width="24px"
      viewBox="0 -960 960 960"
      fill="#e3e3e3"
      {...props}
    >
      <Path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313z" />
    </Svg>
  );
};

