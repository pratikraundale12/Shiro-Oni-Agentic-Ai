import React from 'react';
import PropTypes from 'prop-types';

export const LoginIcon = ({ width = 20, height = 20, color = '#0CBF59' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.5">
        <path
          d="M5.93262 5.04016C6.13928 2.64016 7.37262 1.66016 10.0726 1.66016H10.1593C13.1393 1.66016 14.3326 2.85349 14.3326 5.83349V10.1802C14.3326 13.1602 13.1393 14.3535 10.1593 14.3535H10.0726C7.39262 14.3535 6.15928 13.3868 5.93928 11.0268"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.33301 8H9.91967"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.43262 5.7666L10.666 7.99994L8.43262 10.2333"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

LoginIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
