import React from 'react';
import PropTypes from 'prop-types';

export const StarIcon = ({ width = 24, height = 24, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M12 .5 16 8l7.5 4-7.5 4-4 7.5L8 16 .5 12 8 8l4-7.5Z"
    />
  </svg>
);

StarIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
