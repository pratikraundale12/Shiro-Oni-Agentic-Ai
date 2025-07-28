import PropTypes from 'prop-types';
import React from 'react';

export const CollapseSidebarIconRight = (
  width = '14',
  height = '14',
  color = '#444445'
) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.816 16.25H13.7493C14.266 16.25 14.7243 16.2333 15.1327 16.175C17.3243 15.9333 17.916 14.9 17.916 12.0833V7.91667C17.916 5.1 17.3243 4.06667 15.1327 3.825C14.7243 3.76667 14.266 3.75 13.7493 3.75H10.866"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.48438 3.75H6.25104C5.73438 3.75 5.27604 3.76667 4.86771 3.825C2.67604 4.06667 2.08438 5.1 2.08438 7.91667V12.0833C2.08438 14.9 2.67604 15.9333 4.86771 16.175C5.27604 16.2333 5.73438 16.25 6.25104 16.25H7.48438"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 1.6665V18.3332"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.334 7.0835V12.9168"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CollapseSidebarIconRight.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  stroke: PropTypes.string,
};
