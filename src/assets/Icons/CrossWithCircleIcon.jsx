import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const CrossWithCircleIcon = ({
  width = 33,
  height = 33,
  color = theme.colors.darker,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16.5" cy="16.5" r={16} fill="white" stroke={'#DDE4F0'} />
      <path
        d="M15.1953 16.1381L10 10.9428L10.9428 10L16.1381 15.1952L21.3334 10L22.2762 10.9428L17.0809 16.1381L22.2762 21.3333L21.3334 22.2762L16.1381 17.0809L10.9428 22.2762L10 21.3333L15.1953 16.1381Z"
        fill={color}
      />
    </svg>
  );
};

CrossWithCircleIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
