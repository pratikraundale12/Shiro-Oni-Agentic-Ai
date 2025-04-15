import React from 'react';
import PropTypes from 'prop-types';

export const AppIcon = ({ width = 20, height = 20, color = '#444445' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1667 8.33464H15.8334C17.5001 8.33464 18.3334 7.5013 18.3334 5.83464V4.16797C18.3334 2.5013 17.5001 1.66797 15.8334 1.66797H14.1667C12.5001 1.66797 11.6667 2.5013 11.6667 4.16797V5.83464C11.6667 7.5013 12.5001 8.33464 14.1667 8.33464Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16675 18.3346H5.83341C7.50008 18.3346 8.33341 17.5013 8.33341 15.8346V14.168C8.33341 12.5013 7.50008 11.668 5.83341 11.668H4.16675C2.50008 11.668 1.66675 12.5013 1.66675 14.168V15.8346C1.66675 17.5013 2.50008 18.3346 4.16675 18.3346Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.00008 8.33464C6.84103 8.33464 8.33341 6.84225 8.33341 5.0013C8.33341 3.16035 6.84103 1.66797 5.00008 1.66797C3.15913 1.66797 1.66675 3.16035 1.66675 5.0013C1.66675 6.84225 3.15913 8.33464 5.00008 8.33464Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0001 18.3346C16.841 18.3346 18.3334 16.8423 18.3334 15.0013C18.3334 13.1604 16.841 11.668 15.0001 11.668C13.1591 11.668 11.6667 13.1604 11.6667 15.0013C11.6667 16.8423 13.1591 18.3346 15.0001 18.3346Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

AppIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
};
