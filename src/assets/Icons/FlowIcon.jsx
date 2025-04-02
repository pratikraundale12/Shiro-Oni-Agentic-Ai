import React from 'react';
import PropTypes from 'prop-types';

export const FlowIcon = ({ width = 20, height = 20, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16602 6.66602C5.54673 6.66602 6.66602 5.54673 6.66602 4.16602C6.66602 2.7853 5.54673 1.66602 4.16602 1.66602C2.7853 1.66602 1.66602 2.7853 1.66602 4.16602C1.66602 5.54673 2.7853 6.66602 4.16602 6.66602Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.834 12.5C17.2147 12.5 18.334 11.3807 18.334 10C18.334 8.61929 17.2147 7.5 15.834 7.5C14.4533 7.5 13.334 8.61929 13.334 10C13.334 11.3807 14.4533 12.5 15.834 12.5Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16602 18.334C5.54673 18.334 6.66602 17.2147 6.66602 15.834C6.66602 14.4533 5.54673 13.334 4.16602 13.334C2.7853 13.334 1.66602 14.4533 1.66602 15.834C1.66602 17.2147 2.7853 18.334 4.16602 18.334Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3327 9.99935H7.49935C5.66602 9.99935 4.16602 9.16602 4.16602 6.66602V13.3327"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

FlowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
