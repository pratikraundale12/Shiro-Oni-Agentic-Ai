import React from 'react';
import PropTypes from 'prop-types';

export const NameSpaceIcon = ({
  width = 18,
  height = 20,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M2 8h14V2H2v6Zm16-7v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1Zm-2 9H2v6h14v-6ZM4 12h3v2H4v-2Zm0-8h3v2H4V4Z"
    />
  </svg>
);

NameSpaceIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
