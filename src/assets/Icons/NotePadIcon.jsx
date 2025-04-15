import React from 'react';
import PropTypes from 'prop-types';

export const NotePadIcon = ({ width = 24, height = 24, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.8379 5.83366V14.167C17.8379 16.667 16.5879 18.3337 13.6712 18.3337H7.00456C4.08789 18.3337 2.83789 16.667 2.83789 14.167V5.83366C2.83789 3.33366 4.08789 1.66699 7.00456 1.66699H13.6712C16.5879 1.66699 17.8379 3.33366 17.8379 5.83366Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.4211 3.75V5.41667C12.4211 6.33333 13.1711 7.08333 14.0878 7.08333H15.7545"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.00464 10.833H10.338"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.00464 14.167H13.6713"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

NotePadIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
