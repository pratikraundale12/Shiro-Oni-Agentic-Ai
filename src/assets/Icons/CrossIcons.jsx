import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const CrossIcons = ({
  width = 22,
  height = 22,
  color = theme.colors.darker,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 20"
    {...rest}
  >
    <path
      fill={color}
      d="M8.293 9.707.5 1.914 1.914.499l7.793 7.793L17.5.5l1.414 1.415-7.793 7.793 7.793 7.792-1.414 1.415-7.793-7.793-7.793 7.793L.5 17.499l7.793-7.792Z"
    />
  </svg>
);

CrossIcons.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
