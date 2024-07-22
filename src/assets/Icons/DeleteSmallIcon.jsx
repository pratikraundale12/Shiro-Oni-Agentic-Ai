import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const DeleteSmallIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      fill={color}
      d="M15 4h5v2h-2v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6H0V4h5V1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3Zm1 2H4v12h12V6ZM7 9h2v6H7V9Zm4 0h2v6h-2V9ZM7 2v2h6V2H7Z"
    />
  </svg>
);

DeleteSmallIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
