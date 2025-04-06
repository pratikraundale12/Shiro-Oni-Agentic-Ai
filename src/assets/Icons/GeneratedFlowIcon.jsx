import React from 'react';
import PropTypes from 'prop-types';
export const GeneratedFlowIcon = ({
  width = '22',
  height = '22',
  color = '#444443',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.94101 16C3.64391 14.7274 2.30412 13.6857 1.75395 12.9992C0.65645 11.6297 0 9.8915 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 9.8925 15.3428 11.6315 14.2443 13.0014C13.6944 13.687 12.3558 14.7276 12.059 16H3.94101ZM12 18V19C12 20.1046 11.1046 21 10 21H6C4.89543 21 4 20.1046 4 19V18H12ZM9 8.0048V4L4.5 10.0048H7V14.0048L11.5 8.0048H9Z"
      fill={color}
    />
  </svg>
);

GeneratedFlowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
