import React from 'react';
import PropTypes from 'prop-types';

export const CurvedDocumentIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3327 8.33464V12.5013C18.3327 16.668 16.666 18.3346 12.4993 18.3346H7.49935C3.33268 18.3346 1.66602 16.668 1.66602 12.5013V7.5013C1.66602 3.33464 3.33268 1.66797 7.49935 1.66797H11.666"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3327 8.33464H14.9993C12.4993 8.33464 11.666 7.5013 11.666 5.0013V1.66797L18.3327 8.33464Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83398 10.832H10.834"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83398 14.168H9.16732"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

CurvedDocumentIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
