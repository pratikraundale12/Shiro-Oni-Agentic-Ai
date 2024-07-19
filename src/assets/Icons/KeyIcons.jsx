import React from 'react';
import PropTypes from 'prop-types';

export const KeyIcons = ({ width = 19, height = 18, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M7.758 8.828 15.607.98l1.414 1.414-1.414 1.415 2.474 2.475-1.414 1.414-2.475-2.475-1.414 1.414L14.9 8.757l-1.414 1.415-2.121-2.122-2.192 2.192a5.002 5.002 0 0 1-7.708 6.294 5 5 0 0 1 6.294-7.708Zm-.637 6.293A3 3 0 1 0 2.88 10.88 3 3 0 0 0 7.12 15.12Z"
    />
  </svg>
);

KeyIcons.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
