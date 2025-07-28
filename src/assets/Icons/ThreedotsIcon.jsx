import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const ThreedotsIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.16699 12.6667C7.16699 13.4 7.76699 14 8.50033 14C9.23366 14 9.83366 13.4 9.83366 12.6667C9.83366 11.9333 9.23366 11.3333 8.50033 11.3333C7.76699 11.3333 7.16699 11.9333 7.16699 12.6667Z"
      stroke={color}
    />
    <path
      d="M7.16699 3.33366C7.16699 4.06699 7.76699 4.66699 8.50033 4.66699C9.23366 4.66699 9.83366 4.06699 9.83366 3.33366C9.83366 2.60033 9.23366 2.00033 8.50033 2.00033C7.76699 2.00033 7.16699 2.60033 7.16699 3.33366Z"
      stroke={color}
    />
    <path
      d="M7.16699 7.99967C7.16699 8.73301 7.76699 9.33301 8.50033 9.33301C9.23366 9.33301 9.83366 8.73301 9.83366 7.99967C9.83366 7.26634 9.23366 6.66634 8.50033 6.66634C7.76699 6.66634 7.16699 7.26634 7.16699 7.99967Z"
      stroke={color}
    />
  </svg>
);

ThreedotsIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
