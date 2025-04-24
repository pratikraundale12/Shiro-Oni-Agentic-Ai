import React from 'react';
import PropTypes from 'prop-types';

import { theme } from '../../styles';

export const ClusterDetailTabIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.83268 6.66699H3.33268C2.41602 6.66699 1.66602 5.91699 1.66602 5.00033V3.33366C1.66602 2.41699 2.41602 1.66699 3.33268 1.66699H5.83268C6.74935 1.66699 7.49935 2.41699 7.49935 3.33366V5.00033C7.49935 5.91699 6.74935 6.66699 5.83268 6.66699Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.334 5.83333H14.334C13.784 5.83333 13.334 5.38332 13.334 4.83332V3.50001C13.334 2.95001 13.784 2.5 14.334 2.5H17.334C17.884 2.5 18.334 2.95001 18.334 3.50001V4.83332C18.334 5.38332 17.884 5.83333 17.334 5.83333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.334 12.0833H14.334C13.784 12.0833 13.334 11.6333 13.334 11.0833V9.75001C13.334 9.20001 13.784 8.75 14.334 8.75H17.334C17.884 8.75 18.334 9.20001 18.334 9.75001V11.0833C18.334 11.6333 17.884 12.0833 17.334 12.0833Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 4.16699H13.3333"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.416 4.16699V15.0003C10.416 15.917 11.166 16.667 12.0827 16.667H13.3327"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.416 10.417H13.3327"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.334 18.3333H14.334C13.784 18.3333 13.334 17.8833 13.334 17.3333V16C13.334 15.45 13.784 15 14.334 15H17.334C17.884 15 18.334 15.45 18.334 16V17.3333C18.334 17.8833 17.884 18.3333 17.334 18.3333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ClusterDetailTabIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
