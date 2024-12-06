import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';
export const CalenderIcon2 = ({
  width = 20,
  height = 20,
  color = theme.colors.primary,
}) => (
  <svg
    width={width}
    height={height}
    color={color}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.50008 0.833984V2.50065H12.5001V0.833984H14.1667V2.50065H17.5001C17.9603 2.50065 18.3334 2.87375 18.3334 3.33398V16.6673C18.3334 17.1276 17.9603 17.5007 17.5001 17.5007H2.50008C2.03985 17.5007 1.66675 17.1276 1.66675 16.6673V3.33398C1.66675 2.87375 2.03985 2.50065 2.50008 2.50065H5.83341V0.833984H7.50008ZM16.6667 9.16732H3.33341V15.834H16.6667V9.16732ZM6.66675 10.834V12.5007H5.00008V10.834H6.66675ZM10.8334 10.834V12.5007H9.16675V10.834H10.8334ZM15.0001 10.834V12.5007H13.3334V10.834H15.0001ZM5.83341 4.16732H3.33341V7.50065H16.6667V4.16732H14.1667V5.83398H12.5001V4.16732H7.50008V5.83398H5.83341V4.16732Z"
      fill="#FF7A00"
    />
  </svg>
);
CalenderIcon2.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
