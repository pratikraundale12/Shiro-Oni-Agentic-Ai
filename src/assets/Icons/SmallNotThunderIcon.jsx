import React from 'react';
import PropTypes from 'prop-types';

export const SmallNotThunderIcon = ({
  width = 16,
  height = 20,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path fill={color} d="M13 5v6h3l-5 8v-6H8l5-8Z" />
    <path
      stroke="#444445"
      strokeWidth={0.5}
      d="M0-.25h21.617"
      transform="matrix(.6652 .74666 -.63981 .76853 4 3.2)"
    />
  </svg>
);

SmallNotThunderIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
