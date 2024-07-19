import React from 'react';
import PropTypes from 'prop-types';

export const GreaterArrowIcon = ({
  width = 8,
  height = 14,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="m2.829 7 4.95-4.95L6.363.638 0 7l6.364 6.364 1.414-1.415L2.828 7Z"
    />
  </svg>
);

GreaterArrowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
