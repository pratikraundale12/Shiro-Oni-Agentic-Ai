import React from 'react';
import PropTypes from 'prop-types';
export const FlashIcon = ({ width = 22, height = 22, color = '#444445' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.05877 8.8613H6.11877V13.6656C6.11877 14.7866 6.72543 15.0135 7.46543 14.1727L12.5121 8.43425C13.1321 7.73362 12.8721 7.15311 11.9321 7.15311H9.8721V2.34881C9.8721 1.22781 9.26543 1.00094 8.52543 1.84169L3.47877 7.58015C2.86543 8.28745 3.12543 8.8613 4.05877 8.8613Z"
        stroke={color}
        strokeWidth="1.0009"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
FlashIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
