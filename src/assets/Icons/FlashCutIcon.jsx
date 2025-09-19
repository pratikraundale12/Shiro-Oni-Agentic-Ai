import React from 'react';
import PropTypes from 'prop-types';
export const FlashCutIcon = ({
  width = 22,
  height = 22,
  color = '#444445',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.12012 12.0265V13.6532C6.12012 14.7732 6.72678 14.9998 7.46678 14.1598L12.5135 8.42648C13.1335 7.72648 12.8735 7.14648 11.9335 7.14648H11.3135"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8787 5.89261V2.34595C9.8787 1.22595 9.27203 0.999281 8.53203 1.83928L3.48537 7.57261C2.86537 8.27261 3.12537 8.85261 4.06537 8.85261H6.12537V9.63928"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6663 1.33398L1.33301 14.6673"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
FlashCutIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
