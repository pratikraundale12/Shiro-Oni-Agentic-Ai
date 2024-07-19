import React from 'react';
import PropTypes from 'prop-types';

export const PencilIcon = ({ width = 18, height = 19, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M2 16.89h1.414l9.314-9.314-1.414-1.414L2 15.476v1.414Zm16 2H0v-4.243L13.435 1.212a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L6.243 16.89H18v2ZM12.728 4.748l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414Z"
    />
  </svg>
);

PencilIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
