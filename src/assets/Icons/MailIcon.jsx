import React from 'react';
import PropTypes from 'prop-types';

export const MailIcon = ({
  width = 20,
  height = 18,
  color = '#444445',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M1.66699 7.08366C1.66699 4.16699 3.33366 2.91699 5.83366 2.91699H14.167C16.667 2.91699 18.3337 4.16699 18.3337 7.08366V12.917C18.3337 15.8337 16.667 17.0837 14.167 17.0837H5.83366"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.1663 7.5L11.558 9.58333C10.6997 10.2667 9.29134 10.2667 8.433 9.58333L5.83301 7.5"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 13.75H6.66699"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 10.417H4.16699"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

MailIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
