import React from 'react';
import PropTypes from 'prop-types';

export const HeadphoneIcon = ({
  width = 22,
  height = 22,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 22 22"
  >
    <path
      fill={color}
      d="M18.938 7H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.062A8.001 8.001 0 0 1 11 22v-2a6 6 0 0 0 6-6V8A6 6 0 0 0 5 8v7H2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.062a8.001 8.001 0 0 1 15.876 0ZM2 9v4h1V9H2Zm17 0v4h1V9h-1ZM6.76 14.785l1.06-1.696A5.972 5.972 0 0 0 11 14a5.972 5.972 0 0 0 3.18-.911l1.06 1.696A7.963 7.963 0 0 1 11 16a7.962 7.962 0 0 1-4.24-1.215Z"
    />
  </svg>
);

HeadphoneIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
