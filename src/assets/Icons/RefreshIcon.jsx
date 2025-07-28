import * as React from 'react';
import PropTypes from 'prop-types';

export const RefreshIcon = (
  { width = 18, height = 18, color = '#444445' },
  ...props
) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.3327 9.99935C18.3327 14.5993 14.5993 18.3327 9.99935 18.3327C5.39935 18.3327 2.59102 13.6993 2.59102 13.6993M2.59102 13.6993H6.35768M2.59102 13.6993V17.866M1.66602 9.99935C1.66602 5.39935 5.36602 1.66602 9.99935 1.66602C15.5577 1.66602 18.3327 6.29935 18.3327 6.29935M18.3327 6.29935V2.13268M18.3327 6.29935H14.6327"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RefreshIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
