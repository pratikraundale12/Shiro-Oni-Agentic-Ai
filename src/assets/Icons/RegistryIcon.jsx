import PropTypes from 'prop-types';
import React from 'react';

export const RegistryIcon = ({
  width = 24,
  height = 24,
  color = '#0CBF59',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11H15"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 15H12"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 22H9C4 22 3 19.94 3 15.82V9.65C3 4.95 4.67 3.69 8 3.5H16C19.33 3.68 21 4.95 21 9.65V16"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 16L15 22V19C15 17 16 16 18 16H21Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RegistryIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
