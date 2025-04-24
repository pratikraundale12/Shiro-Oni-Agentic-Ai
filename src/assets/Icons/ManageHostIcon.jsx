import React from 'react';
import PropTypes from 'prop-types';

export const ManageHostIcon = ({
  width = 20,
  height = 20,
  color = 'rgb(68, 68, 69)',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.49935 18.3337H12.4993C16.666 18.3337 18.3327 16.667 18.3327 12.5003V7.50033C18.3327 3.33366 16.666 1.66699 12.4993 1.66699H7.49935C3.33268 1.66699 1.66602 3.33366 1.66602 7.50033V12.5003C1.66602 16.667 3.33268 18.3337 7.49935 18.3337Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9746 15.417V12.167"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9746 6.20801V4.58301"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9733 10.5423C14.1699 10.5423 15.14 9.57227 15.14 8.37565C15.14 7.17903 14.1699 6.20898 12.9733 6.20898C11.7767 6.20898 10.8066 7.17903 10.8066 8.37565C10.8066 9.57227 11.7767 10.5423 12.9733 10.5423Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02539 15.416V13.791"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02539 7.83301V4.58301"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.02409 13.7913C8.22071 13.7913 9.19075 12.8213 9.19075 11.6247C9.19075 10.4281 8.22071 9.45801 7.02409 9.45801C5.82747 9.45801 4.85742 10.4281 4.85742 11.6247C4.85742 12.8213 5.82747 13.7913 7.02409 13.7913Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ManageHostIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
