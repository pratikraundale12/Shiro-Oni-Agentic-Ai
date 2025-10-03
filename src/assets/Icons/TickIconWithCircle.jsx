import React from 'react';
import PropTypes from 'prop-types';
export const TickIconWithCircle = ({ width = 33, height = 33 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16.5" cy="16.5" r={16} fill="white" stroke="#DDE4F0" />
      <path
        d="M14.3331 19.6427L21.9934 11.9824L23.1719 13.1609L14.3331 21.9997L9.02979 16.6965L10.2083 15.518L14.3331 19.6427Z"
        fill="#0CBF59"
      />
    </svg>
  );
};
TickIconWithCircle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
