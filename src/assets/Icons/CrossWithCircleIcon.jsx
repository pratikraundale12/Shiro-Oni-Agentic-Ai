import React from 'react';
import PropTypes from 'prop-types';

export const CrossWithCircleIcon = ({
  height = 18,
  width = 18,
  stroke = '#FF0000',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M6.11426 9.88661L9.88759 6.11328"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.88759 9.88661L6.11426 6.11328"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.99967 14.6666H9.99967C13.333 14.6666 14.6663 13.3333 14.6663 9.99992V5.99992C14.6663 2.66659 13.333 1.33325 9.99967 1.33325H5.99967C2.66634 1.33325 1.33301 2.66659 1.33301 5.99992V9.99992C1.33301 13.3333 2.66634 14.6666 5.99967 14.6666Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CrossWithCircleIcon.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stroke: PropTypes.string,
};
