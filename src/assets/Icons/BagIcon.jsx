import React from 'react';
import PropTypes from 'prop-types';

export const BagIcon = ({ width = 20, height = 20, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 18 22"
  >
    <path
      fill={color}
      d="M15 7h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2V6a6 6 0 1 1 12 0v1ZM2 9v10h14V9H2Zm6 4h2v2H8v-2Zm-4 0h2v2H4v-2Zm8 0h2v2h-2v-2Zm1-6V6a4 4 0 0 0-8 0v1h8Z"
    />
  </svg>
);

BagIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
