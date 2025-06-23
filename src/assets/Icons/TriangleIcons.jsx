import React from 'react';
import PropTypes from 'prop-types';

export const TriangleIcons = ({
  width = 16,
  height = 20,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 19"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_16829_121608)">
      <path
        d="M3.5 9.50029V6.83029C3.5 3.51529 5.8475 2.15779 8.72 3.81529L11.0375 5.15029L13.355 6.48529C16.2275 8.14279 16.2275 10.8578 13.355 12.5153L11.0375 13.8503L8.72 15.1853C5.8475 16.8428 3.5 15.4853 3.5 12.1703V9.50029Z"
        fill={color}
        stroke={color}
        strokeWidth="1.125"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_16829_121608">
        <rect
          width="18"
          height="18"
          fill={color}
          transform="translate(0.5 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

TriangleIcons.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
