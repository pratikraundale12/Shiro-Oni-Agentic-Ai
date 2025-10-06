import React from 'react';
import PropTypes from 'prop-types';

const NewUserIcon = ({ width = 20, height = 20, color = '#444445' }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.1322 9.05835C10.0488 9.05002 9.94883 9.05002 9.85716 9.05835C7.87383 8.99169 6.29883 7.36669 6.29883 5.36669C6.29883 3.32502 7.94883 1.66669 9.99883 1.66669C12.0405 1.66669 13.6988 3.32502 13.6988 5.36669C13.6905 7.36669 12.1155 8.99169 10.1322 9.05835Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.96563 12.1333C3.94896 13.4833 3.94896 15.6833 5.96563 17.025C8.25729 18.5583 12.0156 18.5583 14.3073 17.025C16.324 15.675 16.324 13.475 14.3073 12.1333C12.024 10.6083 8.26562 10.6083 5.96563 12.1333Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
NewUserIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default NewUserIcon;
