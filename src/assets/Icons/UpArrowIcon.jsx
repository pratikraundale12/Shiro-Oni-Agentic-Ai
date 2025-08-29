import PropTypes from 'prop-types';
import React from 'react';

export const UpArrowIcon = ({
  width = 16,
  height = 16,
  color = '#444445',
  ...prop
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.5984 12.5415L11.1651 7.10817C10.5234 6.4665 9.47344 6.4665 8.83177 7.10817L3.39844 12.5415"
      stroke={color}
      stroke-width="1.25"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

UpArrowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
