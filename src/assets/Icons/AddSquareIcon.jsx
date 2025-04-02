import PropTypes from 'prop-types';
import React from 'react';

export const AddsquareIcon = ({
  width = 16,
  height = 16,
  color = '#FF7A00',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33398 8H10.6673"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.6673V5.33398"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.00065 14.6673H10.0007C13.334 14.6673 14.6673 13.334 14.6673 10.0007V6.00065C14.6673 2.66732 13.334 1.33398 10.0007 1.33398H6.00065C2.66732 1.33398 1.33398 2.66732 1.33398 6.00065V10.0007C1.33398 13.334 2.66732 14.6673 6.00065 14.6673Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

AddsquareIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
