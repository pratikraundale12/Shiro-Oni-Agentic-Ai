import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const ThreedotsIcon = ({
  width = 6,
  height = 18,
  color = theme.colors.darker,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    // viewBox="0 0 4 18"
  >
    <path
      fill={color}
      d="M2 0C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0-7C.9 7 0 7.9 0 9s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
    />
  </svg>
);

ThreedotsIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
