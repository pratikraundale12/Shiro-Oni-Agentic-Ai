import React from 'react';
import PropTypes from 'prop-types';

export const MicroSoftIcon = ({ width = 80, height = 80 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={width}
    fill="none"
  >
    <g clipPath="url(#a)">
      <path
        fill="#4CAF50"
        d="M42.5 37.5H80v-35A2.5 2.5 0 0 0 77.5 0h-35v37.5Z"
      />
      <path fill="#F44336" d="M37.5 37.5V0h-35A2.5 2.5 0 0 0 0 2.5v35h37.5Z" />
      <path fill="#2196F3" d="M37.5 42.5H0v35A2.5 2.5 0 0 0 2.5 80h35V42.5Z" />
      <path
        fill="#FFC107"
        d="M42.5 42.5V80h35a2.5 2.5 0 0 0 2.5-2.5v-35H42.5Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h80v80H0z" />
      </clipPath>
    </defs>
  </svg>
);

MicroSoftIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
