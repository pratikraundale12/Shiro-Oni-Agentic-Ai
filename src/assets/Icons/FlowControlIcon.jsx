import React from 'react';
import PropTypes from 'prop-types';

export const FlowControlIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.49935 18.3334H12.4993C16.666 18.3334 18.3327 16.6667 18.3327 12.5001V7.50008C18.3327 3.33341 16.666 1.66675 12.4993 1.66675H7.49935C3.33268 1.66675 1.66602 3.33341 1.66602 7.50008V12.5001C1.66602 16.6667 3.33268 18.3334 7.49935 18.3334Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9746 15.4163V12.1663"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9746 6.20825V4.58325"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9733 10.5418C14.1699 10.5418 15.14 9.57178 15.14 8.37516C15.14 7.17855 14.1699 6.2085 12.9733 6.2085C11.7767 6.2085 10.8066 7.17855 10.8066 8.37516C10.8066 9.57178 11.7767 10.5418 12.9733 10.5418Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02539 15.4165V13.7915"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02539 7.83325V4.58325"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02409 13.7913C8.22071 13.7913 9.19075 12.8213 9.19075 11.6247C9.19075 10.4281 8.22071 9.45801 7.02409 9.45801C5.82747 9.45801 4.85742 10.4281 4.85742 11.6247C4.85742 12.8213 5.82747 13.7913 7.02409 13.7913Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

FlowControlIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
