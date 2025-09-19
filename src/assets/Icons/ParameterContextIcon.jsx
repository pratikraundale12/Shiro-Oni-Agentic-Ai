import React from 'react';
import PropTypes from 'prop-types';

export const ParameterContextIcon = ({
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
      d="M2.64258 6.20044L10.0009 10.4588L17.3092 6.22544"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.0083V10.45"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.27552 2.06682L3.82552 4.53349C2.81719 5.09182 1.99219 6.49182 1.99219 7.64182V12.3502C1.99219 13.5002 2.81719 14.9002 3.82552 15.4585L8.27552 17.9335C9.22552 18.4585 10.7839 18.4585 11.7339 17.9335L16.1839 15.4585C17.1922 14.9002 18.0172 13.5002 18.0172 12.3502V7.64182C18.0172 6.49182 17.1922 5.09182 16.1839 4.53349L11.7339 2.05849C10.7755 1.53349 9.22552 1.53349 8.27552 2.06682Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ParameterContextIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
