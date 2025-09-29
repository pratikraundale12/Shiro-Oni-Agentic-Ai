import React from 'react';
import PropTypes from 'prop-types';

export const Hierarchy = ({
  width = 24,
  height = 24,
  color = 'black',
  plusSignBackground = '#040404',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 210 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.25 118.125V65.625C61.25 63.2088 63.2088 61.25 65.625 61.25H113.75C116.166 61.25 118.125 63.2088 118.125 65.625V95.375"
        stroke={color}
        strokeWidth="8.75"
      />
      <path d="M35 61.25L35 109.375" stroke={color} strokeWidth="8.75" />
      <path d="M148.75 175L100.625 175" stroke={color} strokeWidth="8.75" />
      <path d="M175 59.25L175 146.75" stroke={color} strokeWidth="8.75" />
      <path d="M60.25 35L147.75 35" stroke={color} strokeWidth="8.75" />
      <rect
        x="157.5"
        y="21.875"
        width="26.25"
        height="26.25"
        rx="4.375"
        stroke={color}
        strokeWidth="8.75"
      />
      <rect
        x="21.875"
        y="21.875"
        width="26.25"
        height="26.25"
        rx="4.375"
        stroke={color}
        strokeWidth="8.75"
      />
      <rect
        x="157.5"
        y="157.5"
        width="26.25"
        height="26.25"
        rx="4.375"
        stroke={color}
        strokeWidth="8.75"
      />
      <path
        d="M91.875 133.583V96.25C91.875 93.8338 93.8338 91.875 96.25 91.875H140C142.416 91.875 144.375 93.8338 144.375 96.25V144.375C144.375 146.791 142.416 148.75 140 148.75H96.1483"
        stroke={color}
        strokeWidth="8.75"
      />
      <circle cx="63.4375" cy="146.562" r="37.1875" fill={plusSignBackground} />
      <path
        d="M63.9793 126.875V163.333"
        stroke="white"
        strokeWidth="8.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45.75 145.103H82.2083"
        stroke="white"
        strokeWidth="8.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

Hierarchy.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  plusSignBackground: PropTypes.string,
};
