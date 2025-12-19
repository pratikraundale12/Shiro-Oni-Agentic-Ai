import React from 'react';
import PropTypes from 'prop-types';

export const SquareBoxIcon = ({
  width = 16,
  height = 16,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.8 21H15.2C19.7 21 21.5 19.2 21.5 14.7V9.3C21.5 4.8 19.7 3 15.2 3H9.8C5.3 3 3.5 4.8 3.5 9.3V14.7C3.5 19.2 5.3 21 9.8 21Z"
      fill={color}
      stroke="#B5BDC8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SquareBoxIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
