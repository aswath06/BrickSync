import React from 'react';
import Svg, { Path } from 'react-native-svg';

type ArrowBackProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const ArrowBack: React.FC<ArrowBackProps> = ({
  width = 24,
  height = 24,
  color = '#e3e3e3',
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 -960 960 960"
      fill={color}
      {...props}
    >
      <Path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313z" />
    </Svg>
  );
};
