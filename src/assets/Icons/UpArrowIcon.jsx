import React from 'react';
import PropTypes from 'prop-types';

export const UpArrowIcon = ({ width = 14, height = 8, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...prop}
  >
    <path
      fill={color}
      d="m7 2.828 4.95 4.95 1.413-1.414L7 0 .635 6.364 2.05 7.778 7 2.828Z"
    />
  </svg>
);

UpArrowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
