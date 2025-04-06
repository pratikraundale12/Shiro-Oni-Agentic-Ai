import React from 'react';
import PropTypes from 'prop-types';

export const ClockIcon = ({ width = 20, height = 20, color = '#444445' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <path
        fill={color}
        stroke="#444445"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.25}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.333 10.001c0 4.6-3.733 8.334-8.333 8.334A8.336 8.336 0 0 1 1.667 10c0-4.6 3.733-8.333 8.333-8.333s8.333 3.733 8.333 8.333Z"
      />
      <path
        fill={color}
        stroke="#444445"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.25}
        fillRule="evenodd"
        clipRule="evenodd"
        d="m13.09 12.65-2.583-1.542c-.45-.267-.816-.909-.816-1.434V6.258"
      />
    </svg>
  );
};

ClockIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
