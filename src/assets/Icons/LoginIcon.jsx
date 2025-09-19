import React from 'react';
import PropTypes from 'prop-types';

export const LoginIcon = ({ width = 20, height = 20, color = '#06C270' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.93164 5.04016C6.13831 2.64016 7.37164 1.66016 10.0716 1.66016H10.1583C13.1383 1.66016 14.3316 2.85349 14.3316 5.83349V10.1802C14.3316 13.1602 13.1383 14.3535 10.1583 14.3535H10.0716C7.39164 14.3535 6.15831 13.3868 5.93831 11.0268"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.33398 8H9.92065"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.43164 5.7666L10.665 7.99994L8.43164 10.2333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

LoginIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
