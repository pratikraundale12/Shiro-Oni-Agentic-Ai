import React from 'react';
import PropTypes from 'prop-types';

export const OpenLinkIcon = ({
  width = '16',
  height = '16',
  color = '#FF7A00',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.71387 8.28893L14.1805 2.82227"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7127 5.48809V2.28809H11.5127"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.37988 2.28809H6.04655C2.71322 2.28809 1.37988 3.62142 1.37988 6.95475V10.9548C1.37988 14.2881 2.71322 15.6214 6.04655 15.6214H10.0465C13.3799 15.6214 14.7132 14.2881 14.7132 10.9548V9.62142"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

OpenLinkIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
