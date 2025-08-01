import PropTypes from 'prop-types';
import React from 'react';
export const TagIcon = ({ width = 20, height = 20, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.67063 12.9386L7.44563 16.7136C8.99563 18.2636 11.5123 18.2636 13.0706 16.7136L16.729 13.0553C18.279 11.5053 18.279 8.98864 16.729 7.43031L12.9456 3.66364C12.154 2.87197 11.0623 2.44697 9.94563 2.50531L5.77896 2.70531C4.1123 2.78031 2.7873 4.10531 2.70396 5.76364L2.50396 9.93031C2.45396 11.0553 2.87896 12.147 3.67063 12.9386Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.11214 10.1891C9.26274 10.1891 10.1955 9.25639 10.1955 8.10579C10.1955 6.9552 9.26274 6.02246 8.11214 6.02246C6.96155 6.02246 6.02881 6.9552 6.02881 8.10579C6.02881 9.25639 6.96155 10.1891 8.11214 10.1891Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M11.0288 14.3558L14.3621 11.0225"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

TagIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
