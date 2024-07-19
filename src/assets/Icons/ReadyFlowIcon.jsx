import React from 'react';
import PropTypes from 'prop-types';

export const ReadyFlowIcon = ({
  width = 20,
  height = 18,
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
      d="M0 1a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Zm2 1v14h16V2H2Zm2 2h5v4H4V4Zm5 6H4v4h5v-4Zm2-6h5v4h-5V4Zm5 6h-5v4h5v-4Z"
    />
  </svg>
);

ReadyFlowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
