import React from 'react';
import PropTypes from 'prop-types';

export const RightCircleIcon = ({
  width = 80,
  height = 80,
  color = '0CBF59',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0 0 17.909 0 40s17.909 40 40 40Z"
    />
    <path
      fill="#fff"
      d="M36.602 54.465a4.391 4.391 0 0 1-3.47-1.697l-6.137-7.89a4.4 4.4 0 0 1 .771-6.168l.22-.172a4.401 4.401 0 0 1 6.17.771 3.909 3.909 0 0 0 5.924.289l12.46-13.152a4.394 4.394 0 0 1 6.214-.167l.203.192a4.396 4.396 0 0 1 .168 6.214L39.792 53.092a4.39 4.39 0 0 1-3.19 1.373Z"
    />
  </svg>
);

RightCircleIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
