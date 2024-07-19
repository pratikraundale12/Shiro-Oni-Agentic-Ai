import React from 'react';
import PropTypes from 'prop-types';

export const TriangleExclamationMarkIcon = ({
  width = 80,
  height = 71,
  color = '#C52B2B',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="m9.721.5 7.939 13.75a.833.833 0 0 1-.722 1.25H1.061a.833.833 0 0 1-.722-1.25L8.278.5A.833.833 0 0 1 9.72.5ZM8.166 11.334V13h1.667v-1.666H8.166Zm0-5.834v4.167h1.667V5.5H8.166Z"
    />
  </svg>
);

TriangleExclamationMarkIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
