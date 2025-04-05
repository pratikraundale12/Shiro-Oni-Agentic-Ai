import React from 'react';
import PropTypes from 'prop-types';

export const CheckListIcon = ({
  width = 19,
  height = 18,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6.09961H7.5"
      stroke={color}
      strokeWidth="0.75"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 8.09961H6.19"
      stroke={color}
      strokeWidth="0.75"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 3H7C8 3 8 2.5 8 2C8 1 7.5 1 7 1H5C4.5 1 4 1 4 2C4 3 4.5 3 5 3Z"
      stroke={color}
      strokeWidth="0.75"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2.00977C9.665 2.09977 10.5 2.71477 10.5 4.99977V7.99977C10.5 9.99977 10 10.9998 7.5 10.9998H4.5C2 10.9998 1.5 9.99977 1.5 7.99977V4.99977C1.5 2.71977 2.335 2.09977 4 2.00977"
      stroke={color}
      strokeWidth="0.75"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CheckListIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
