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
      d="M5.43182 0V5.57144H8.09091L3.65909 13V7.42858H1L5.43182 0Z"
      fill={color}
    />
    <line
      x1="1.63461"
      y1="0.0664726"
      x2="8.13458"
      y2="12.1379"
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
