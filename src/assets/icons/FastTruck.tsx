import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const FastTruck: React.FC<any> = ({ width = 24, height = 24, color = "#1f1f1f", ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 -960 960 960"
      fill={color}
      {...props}
    >
      <Path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35zm357-280h193l4-21-74-99h-95l-28 120zm-19-273l2-7-84 360 2-7 34-146 46-200zM20-427l20-80h220l-20 80H20zm80-146l20-80h260l-20 80H100zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240z" />
    </Svg>
  )
}
