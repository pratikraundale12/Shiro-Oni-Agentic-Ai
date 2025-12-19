import React from 'react';
import PropTypes from 'prop-types';

const GroupUserIcon = ({ width = 20, height = 20, color = '#444445' }) => {
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
          d="M7.63216 9.05835C7.54883 9.05002 7.44883 9.05002 7.35716 9.05835C5.37383 8.99169 3.79883 7.36669 3.79883 5.36669C3.79883 3.32502 5.44883 1.66669 7.49883 1.66669C9.54049 1.66669 11.1988 3.32502 11.1988 5.36669C11.1905 7.36669 9.61549 8.99169 7.63216 9.05835Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.6757 3.33331C15.2924 3.33331 16.5924 4.64165 16.5924 6.24998C16.5924 7.82498 15.3424 9.10831 13.784 9.16665C13.7174 9.15831 13.6424 9.15831 13.5674 9.16665"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.46563 12.1333C1.44896 13.4833 1.44896 15.6833 3.46563 17.025C5.75729 18.5583 9.51563 18.5583 11.8073 17.025C13.824 15.675 13.824 13.475 11.8073 12.1333C9.52396 10.6083 5.76562 10.6083 3.46563 12.1333Z"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.2832 16.6667C15.8832 16.5417 16.4499 16.3 16.9165 15.9417C18.2165 14.9667 18.2165 13.3584 16.9165 12.3834C16.4582 12.0334 15.8999 11.8 15.3082 11.6667"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
GroupUserIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default GroupUserIcon;
