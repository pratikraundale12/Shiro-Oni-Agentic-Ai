import React from 'react';
import PropTypes from 'prop-types';

export const RoleswtichIcon = ({ width = 20, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 15C22 18.87 18.87 22 15 22L16.05 20.25"
      stroke="#444445"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 9C2 5.13 5.13 2 9 2L7.95 3.75"
      stroke="#444445"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.50008 17.5C6.65067 17.5 7.58341 16.5672 7.58341 15.4166C7.58341 14.2661 6.65067 13.3333 5.50008 13.3333C4.34949 13.3333 3.41675 14.2661 3.41675 15.4166C3.41675 16.5672 4.34949 17.5 5.50008 17.5Z"
      stroke="#444445"
      strokeWidth="1.11111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.07923 21.6667C9.07923 20.0542 7.47506 18.75 5.50006 18.75C3.52506 18.75 1.9209 20.0542 1.9209 21.6667"
      stroke="#444445"
      strokeWidth="1.11111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5001 5.49998C19.6507 5.49998 20.5834 4.56724 20.5834 3.41665C20.5834 2.26605 19.6507 1.33331 18.5001 1.33331C17.3495 1.33331 16.4167 2.26605 16.4167 3.41665C16.4167 4.56724 17.3495 5.49998 18.5001 5.49998Z"
      stroke="#444445"
      strokeWidth="1.11111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.0792 9.66667C22.0792 8.05417 20.4751 6.75 18.5001 6.75C16.5251 6.75 14.9209 8.05417 14.9209 9.66667"
      stroke="#444445"
      strokeWidth="1.11111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RoleswtichIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
