import React from 'react';
import PropTypes from 'prop-types';

export const TermsOfUseIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2.2334V5.2334"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2.2334V5.2334"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 13.2334H15"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 17.2334H12"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3.7334C19.33 3.9134 21 5.1834 21 9.8834V16.0634C21 20.1834 20 22.2434 15 22.2434H9C4 22.2434 3 20.1834 3 16.0634V9.8834C3 5.1834 4.67 3.9234 8 3.7334H16Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

TermsOfUseIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
