import React from 'react';
import PropTypes from 'prop-types';

export const TriangleIcons = ({
  width = 16,
  height = 20,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 25"
  >
    <path
      fill={color}
      d="M0 18.196V1.804A1 1 0 0 1 1.53.956l13.113 8.196a1 1 0 0 1 0 1.696L1.53 19.044A1 1 0 0 1 0 18.196Z"
    />
  </svg>
);

TriangleIcons.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
