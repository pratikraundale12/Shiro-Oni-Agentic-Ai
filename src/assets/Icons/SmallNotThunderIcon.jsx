import React from 'react';
import PropTypes from 'prop-types';

export const SmallNotThunderIcon = ({
  width = 24,
  height = 24,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 9 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.37183 0.800781V6.8008H8.37183L3.37183 14.8008V8.8008H0.371826L5.37183 0.800781Z"
      fill={color}
    />
    <line
      x1="1.22012"
      y1="0.881475"
      x2="8.22012"
      y2="13.8815"
      stroke={color}
      strokeWidth="0.5"
    />
  </svg>
);

SmallNotThunderIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
