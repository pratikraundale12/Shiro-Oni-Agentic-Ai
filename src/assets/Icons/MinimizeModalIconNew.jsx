import React from 'react';
import PropTypes from 'prop-types';

export const MinimizeModalIconNew = ({
  width = 36,
  height = 36,
  color = '#FFFFFF',
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24.666 16.3333L19.666 16.3333L19.666 11.3333"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.6667 16.3333L25.5 10.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.334 19.6667L10.5007 25.5001"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.334 19.6668L16.334 19.6668L16.334 24.6668"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

MinimizeModalIconNew.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
};
