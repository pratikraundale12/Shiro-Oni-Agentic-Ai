import React from 'react';
import PropTypes from 'prop-types';

export const SanityCheckIcon = ({
  width = 16,
  height = 16,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.0011 17.911C23.0211 18.661 22.8211 19.371 22.4611 19.981C22.2611 20.341 21.9912 20.671 21.6912 20.941C21.0012 21.581 20.0911 21.971 19.0811 22.001C17.6211 22.031 16.3311 21.2811 15.6211 20.1311C15.2411 19.5411 15.0111 18.8311 15.0011 18.0811C14.9711 16.8211 15.5311 15.681 16.4311 14.931C17.1111 14.371 17.9712 14.021 18.9112 14.001C21.1212 13.951 22.9511 15.701 23.0011 17.911Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.4421 18.0308L18.4521 18.9907L20.5421 16.9707"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16943 7.43945L11.9994 12.5494L20.7694 7.46942"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0007 21.6091V12.5391"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.6106 9.17V14.83C21.6106 14.88 21.6106 14.92 21.6006 14.97C20.9006 14.36 20.0006 14 19.0006 14C18.0606 14 17.1906 14.33 16.5006 14.88C15.5806 15.61 15.0006 16.74 15.0006 18C15.0006 18.75 15.2106 19.46 15.5806 20.06C15.6706 20.22 15.7806 20.37 15.9006 20.51L14.0706 21.52C12.9306 22.16 11.0706 22.16 9.9306 21.52L4.59061 18.56C3.38061 17.89 2.39062 16.21 2.39062 14.83V9.17C2.39062 7.79 3.38061 6.11002 4.59061 5.44002L9.9306 2.48C11.0706 1.84 12.9306 1.84 14.0706 2.48L19.4106 5.44002C20.6206 6.11002 21.6106 7.79 21.6106 9.17Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SanityCheckIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
