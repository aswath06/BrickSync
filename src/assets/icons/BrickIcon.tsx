import * as React from "react";
import Svg, { Path } from "react-native-svg";

type BrickIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const BrickIcon: React.FC<BrickIconProps> = ({
  width = 24,
  height = 24,
  color = "#e3e3e3",
  ...props
}) => {
  return (
    <Svg
      height={height}
      width={width}
      viewBox="0 -960 960 960"
      fill={color}
      {...props}
    >
      <Path d="M80-160v-480h120v-160h240v160h80v-160h240v160h120v480H80zm80-80h640v-320H160v320zm120-400h80v-80h-80v80zm320 0h80v-80h-80v80zM160-240h640-640zm120-400h80-80zm320 0h80-80z" />
    </Svg>
  );
};
