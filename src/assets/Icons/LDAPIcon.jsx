import React from 'react';
import PropTypes from 'prop-types';

export const LDAPIcon = ({ width = 20, height = 20, color = '#444445' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3416 2.43359L16.2583 4.61693C17.6749 5.24193 17.6749 6.27526 16.2583 6.90026L11.3416 9.08359C10.7833 9.33359 9.8666 9.33359 9.30827 9.08359L4.3916 6.90026C2.97493 6.27526 2.97493 5.24193 4.3916 4.61693L9.30827 2.43359C9.8666 2.18359 10.7833 2.18359 11.3416 2.43359Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.16797C3 9.86797 3.525 10.6763 4.16667 10.9596L9.825 13.4763C10.2583 13.668 10.75 13.668 11.175 13.4763L16.8333 10.9596C17.475 10.6763 18 9.86797 18 9.16797"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13.332C3 14.107 3.45833 14.807 4.16667 15.1237L9.825 17.6404C10.2583 17.832 10.75 17.832 11.175 17.6404L16.8333 15.1237C17.5417 14.807 18 14.107 18 13.332"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

LDAPIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
};
