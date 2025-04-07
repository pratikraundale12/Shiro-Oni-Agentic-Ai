import React from 'react';
import PropTypes from 'prop-types';

export const CubeIcon = ({ width = 18, height = 19, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.64258 6.2002L10.0009 10.4585L17.3092 6.2252"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.0085V10.4502"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.27552 2.06609L3.82552 4.53275C2.81719 5.09109 1.99219 6.49109 1.99219 7.64109V12.3494C1.99219 13.4994 2.81719 14.8994 3.82552 15.4578L8.27552 17.9328C9.22552 18.4578 10.7839 18.4578 11.7339 17.9328L16.1839 15.4578C17.1922 14.8994 18.0172 13.4994 18.0172 12.3494V7.64109C18.0172 6.49109 17.1922 5.09109 16.1839 4.53275L11.7339 2.05775C10.7755 1.53275 9.22552 1.53275 8.27552 2.06609Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CubeIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
