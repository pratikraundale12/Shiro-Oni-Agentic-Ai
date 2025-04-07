import React from 'react';
import PropTypes from 'prop-types';

export const GalleryIcon = ({ height = 20, width = 20, color = '#444445' }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.49996 18.3346H12.5C16.6666 18.3346 18.3333 16.668 18.3333 12.5013V7.5013C18.3333 3.33464 16.6666 1.66797 12.5 1.66797H7.49996C3.33329 1.66797 1.66663 3.33464 1.66663 7.5013V12.5013C1.66663 16.668 3.33329 18.3346 7.49996 18.3346Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.50004 8.33333C8.42052 8.33333 9.16671 7.58714 9.16671 6.66667C9.16671 5.74619 8.42052 5 7.50004 5C6.57957 5 5.83337 5.74619 5.83337 6.66667C5.83337 7.58714 6.57957 8.33333 7.50004 8.33333Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.22656 15.7898L6.3349 13.0315C6.99323 12.5898 7.94323 12.6398 8.5349 13.1482L8.8099 13.3898C9.4599 13.9482 10.5099 13.9482 11.1599 13.3898L14.6266 10.4148C15.2766 9.85651 16.3266 9.85651 16.9766 10.4148L18.3349 11.5815"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

GalleryIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
