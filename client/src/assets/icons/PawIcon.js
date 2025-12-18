import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

const PawIcon = ({ size = 24, color = '#F48400' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="16" r="3" fill={color} />
      <Circle cx="8" cy="12" r="2" fill={color} />
      <Circle cx="16" cy="12" r="2" fill={color} />
      <Circle cx="6" cy="8" r="1.5" fill={color} />
      <Circle cx="18" cy="8" r="1.5" fill={color} />
    </Svg>
  );
};

export default PawIcon;
