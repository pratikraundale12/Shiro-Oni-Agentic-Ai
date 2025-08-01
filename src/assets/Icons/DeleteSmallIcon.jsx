import React from 'react';
import PropTypes from 'prop-types';

export const DeleteSmallIcon = ({
  width = 20,
  height = 20,
  color = '#FF0000',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3.98763C11.78 3.76763 9.54667 3.6543 7.32 3.6543C6 3.6543 4.68 3.72096 3.36 3.8543L2 3.98763"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66699 3.31203L5.81366 2.4387C5.92033 1.80536 6.00033 1.33203 7.12699 1.33203H8.87366C10.0003 1.33203 10.087 1.83203 10.187 2.44536L10.3337 3.31203"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5679 6.09375L12.1346 12.8071C12.0612 13.8537 12.0012 14.6671 10.1412 14.6671H5.86124C4.00124 14.6671 3.94124 13.8537 3.8679 12.8071L3.43457 6.09375"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.8877 11H9.1077"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33301 8.33398H9.66634"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

DeleteSmallIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
