import PropTypes from 'prop-types';
import React from 'react';

export const SortIcon = ({ width = 16, height = 16, color = '#B5B5BD' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      style={{ fill: color }}
      d="M7.96662 5.29983L7.02382 6.24264L5.33394 4.552L5.33344 13.3333H4.00011L4.00061 4.552L2.30976 6.24264L1.36694 5.29983L4.66678 2L7.96662 5.29983ZM14.6333 10.7002L11.3334 14L8.03362 10.7002L8.97642 9.75733L10.6673 11.448L10.6667 2.66667H12.0001L12.0006 11.448L13.6905 9.75733L14.6333 10.7002Z"
      fill={color}
    />
  </svg>
);
SortIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
