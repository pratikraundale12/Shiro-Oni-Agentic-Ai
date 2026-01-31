import React from 'react';
import PropTypes from 'prop-types';

export const SolveWithAiIcon = ({
  height = 20,
  width = 20,
  color = '#fff',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0334 3.03341L16.9667 1.96674C16.873 1.87201 16.7614 1.7968 16.6384 1.74548C16.5153 1.69415 16.3834 1.66772 16.2501 1.66772C16.1168 1.66772 15.9848 1.69415 15.8618 1.74548C15.7388 1.7968 15.6272 1.87201 15.5334 1.96674L1.96674 15.5334C1.87201 15.6272 1.7968 15.7388 1.74548 15.8618C1.69415 15.9848 1.66772 16.1168 1.66772 16.2501C1.66772 16.3834 1.69415 16.5153 1.74548 16.6384C1.7968 16.7614 1.87201 16.873 1.96674 16.9667L3.03341 18.0334C3.1266 18.1292 3.23802 18.2053 3.36112 18.2572C3.48421 18.3092 3.61647 18.336 3.75008 18.336C3.88369 18.336 4.01595 18.3092 4.13904 18.2572C4.26213 18.2053 4.37356 18.1292 4.46674 18.0334L18.0334 4.46674C18.1292 4.37356 18.2053 4.26213 18.2572 4.13904C18.3092 4.01595 18.336 3.88369 18.336 3.75008C18.336 3.61647 18.3092 3.48421 18.2572 3.36112C18.2053 3.23802 18.1292 3.1266 18.0334 3.03341Z"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 5.83325L14.1667 8.33325"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16675 5V8.33333"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8333 11.6667V15.0001"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33325 1.66675V3.33341"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83333 6.66675H2.5"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5001 13.3333H14.1667"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16667 2.5H7.5"
        stroke={color}
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

SolveWithAiIcon.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
};
