import React from 'react';
import PropTypes from 'prop-types';

export const TriangleExclamationMarkIcon = ({
  width = 16,
  height = 16,
  color = '#B5BDC8',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 2 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.57727 1.99946L14.9281 12.9995C15.1123 13.3183 15.003 13.7261 14.6841 13.9101C14.5828 13.9687 14.4678 13.9995 14.3508 13.9995H1.64909C1.2809 13.9995 0.982422 13.701 0.982422 13.3328C0.982422 13.2157 1.01323 13.1008 1.07174 12.9995L7.4226 1.99946C7.60667 1.6806 8.0144 1.57135 8.33327 1.75544C8.4346 1.81396 8.5188 1.89812 8.57727 1.99946ZM7.33327 10.6661V11.9995H8.6666V10.6661H7.33327ZM7.33327 5.99946V9.33282H8.6666V5.99946H7.33327Z"
      fill={color}
    />
  </svg>
);

TriangleExclamationMarkIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
