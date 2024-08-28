import React from 'react';
import PropTypes from 'prop-types';

export const PolicyIcon = ({ width = 18, height = 19, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 25"
  >
    <path
      fill={color}
      d="M15 4.23438H5V20.2344H19V8.23438H15V4.23438ZM3 3.22618C3 2.67843 3.44749 2.23438 3.9985 2.23438H16L20.9997 7.23438L21 21.2269C21 21.7833 20.5551 22.2344 20.0066 22.2344H3.9934C3.44476 22.2344 3 21.7791 3 21.2426V3.22618ZM11 11.2344H13V17.2344H11V11.2344ZM11 7.23438H13V9.23438H11V7.23438Z"
    />
  </svg>
);

PolicyIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
