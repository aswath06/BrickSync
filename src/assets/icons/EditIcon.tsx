import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const EditIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#e3e3e3"
      {...props}
    >
      <Path d="M200-200h57l391-391-57-57-391 391v57zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120zm640-584l-56-56 56 56zm-141 85l-28-29 57 57-29-28z" />
    </Svg>
  );
};

