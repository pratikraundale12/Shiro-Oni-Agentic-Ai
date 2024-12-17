import PropTypes from 'prop-types';
import React from 'react';

export const FitIcon = ({
  width = 50,
  height = 50,
  color = '#444445',
  onClick,
}) => (
  <svg
    width={width}
    height={height}
    onClick={onClick}
    viewBox="0 0 50 50"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="49"
      height="49"
      rx="24.5"
      fill="#F5F7FA"
      stroke="#E9E0E0"
    />

    <g transform="translate(13, 13)">
      <path
        d="M17.5858 5H14V3H21V10H19V6.41421L14.7071 10.7071L13.2929 9.29289L17.5858 5ZM3 14H5V17.5858L9.29289 13.2929L10.7071 14.7071L6.41421 19H10V21H3V14Z"
        fill="#444445"
      />
    </g>
  </svg>
);

FitIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func,
};
