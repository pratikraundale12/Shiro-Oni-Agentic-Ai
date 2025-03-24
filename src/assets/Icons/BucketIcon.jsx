import React from 'react';
import PropTypes from 'prop-types';

export const BucketIcon = ({ width = 20, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.25 8.51562V15.8323C16.25 17.499 15.8333 18.3323 13.75 18.3323H6.25C4.16667 18.3323 3.75 17.499 3.75 15.8323V8.51562"
      stroke="#444445"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M4.16602 1.66602H15.8327C17.4993 1.66602 18.3327 2.49935 18.3327 4.16602V5.83268C18.3327 7.49935 17.4993 8.33268 15.8327 8.33268H4.16602C2.49935 8.33268 1.66602 7.49935 1.66602 5.83268V4.16602C1.66602 2.49935 2.49935 1.66602 4.16602 1.66602Z"
      stroke="#444445"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M8.48242 11.666H11.5158"
      stroke="#444445"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

BucketIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
