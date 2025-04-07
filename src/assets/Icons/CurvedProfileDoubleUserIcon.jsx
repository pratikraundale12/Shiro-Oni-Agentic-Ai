import React from 'react';
import PropTypes from 'prop-types';

export const CurvedProfileDoubleUserIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
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
        fill={color}
        d="M7.63216 9.05964C7.54883 9.0513 7.44883 9.0513 7.35716 9.05964C5.37383 8.99297 3.79883 7.36797 3.79883 5.36797C3.79883 3.3263 5.44883 1.66797 7.49883 1.66797C9.54049 1.66797 11.1988 3.3263 11.1988 5.36797C11.1905 7.36797 9.61549 8.99297 7.63216 9.05964Z"
        stroke="#444445"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color}
        d="M13.6762 3.33203C15.2929 3.33203 16.5929 4.64036 16.5929 6.2487C16.5929 7.8237 15.3429 9.10703 13.7845 9.16536C13.7179 9.15703 13.6429 9.15703 13.5679 9.16536"
        stroke="#444445"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color}
        d="M3.46563 12.132C1.44896 13.482 1.44896 15.682 3.46563 17.0237C5.75729 18.557 9.51563 18.557 11.8073 17.0237C13.824 15.6737 13.824 13.4737 11.8073 12.132C9.52396 10.607 5.76562 10.607 3.46563 12.132Z"
        stroke="#444445"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color}
        d="M15.2832 16.668C15.8832 16.543 16.4499 16.3013 16.9165 15.943C18.2165 14.968 18.2165 13.3596 16.9165 12.3846C16.4582 12.0346 15.8999 11.8013 15.3082 11.668"
        stroke="#444445"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

CurvedProfileDoubleUserIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
