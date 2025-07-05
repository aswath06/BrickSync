import * as React from "react";
import Svg, { Path } from "react-native-svg";

type BagOutlineIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const BagOutlineIcon: React.FC<BagOutlineIconProps> = ({
  width = 20,
  height = 22,
  color = "#000",
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 22"
      fill="none"
      {...props}
    >
      <Path
        d="M3.766 5.922c-1.112.922-1.404 2.483-1.99 5.603-.823 4.39-1.234 6.584-.034 8.03C2.942 21 5.174 21 9.64 21h.722c4.465 0 6.698 0 7.897-1.445 1.2-1.446.787-3.64-.035-8.03-.586-3.12-.878-4.681-1.99-5.603m.002 0C15.125 5 13.536 5 10.36 5h-.722c-3.175 0-4.763 0-5.874.922"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        opacity={0.5}
        d="M7 5V4a3 3 0 116 0v1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};
