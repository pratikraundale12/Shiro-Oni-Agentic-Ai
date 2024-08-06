import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const DeleteSmallIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="6 6 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.1666 11.0003H24.3333V12.667H22.6666V23.5003C22.6666 23.9606 22.2935 24.3337 21.8333 24.3337H10.1666C9.70639 24.3337 9.33329 23.9606 9.33329 23.5003V12.667H7.66663V11.0003H11.8333V8.50033C11.8333 8.04009 12.2064 7.66699 12.6666 7.66699H19.3333C19.7935 7.66699 20.1666 8.04009 20.1666 8.50033V11.0003ZM21 12.667H11V22.667H21V12.667ZM13.5 15.167H15.1666V20.167H13.5V15.167ZM16.8333 15.167H18.5V20.167H16.8333V15.167ZM13.5 9.33366V11.0003H18.5V9.33366H13.5Z"
      fill={color}
    />
  </svg>
);

DeleteSmallIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
