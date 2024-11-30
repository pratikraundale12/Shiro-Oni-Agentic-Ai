import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const OpenEyeIcon = ({
  width = 24,
  height = 24,
  color = theme.colors.darker,
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M2.16667 5.66699V15.667H13.8333V5.66699H2.16667ZM2.16667 4.00033H13.8333V2.33366H2.16667V4.00033ZM14.6667 17.3337H1.33333C0.8731 17.3337 0.5 16.9606 0.5 16.5003V1.50033C0.5 1.04009 0.8731 0.666992 1.33333 0.666992H14.6667C15.1269 0.666992 15.5 1.04009 15.5 1.50033V16.5003C15.5 16.9606 15.1269 17.3337 14.6667 17.3337ZM3.83333 7.33366H7.16667V10.667H3.83333V7.33366ZM3.83333 12.3337H12.1667V14.0003H3.83333V12.3337ZM8.83333 8.16699H12.1667V9.83366H8.83333V8.16699Z"
      fill={color}
    />
  </svg>
);

OpenEyeIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
