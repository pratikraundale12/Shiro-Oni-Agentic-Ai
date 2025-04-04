import React from 'react';
import PropTypes from 'prop-types';

export const ClockIcon = () => {
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.3334 10.0013C18.3334 14.6013 14.6001 18.3346 10.0001 18.3346C5.40008 18.3346 1.66675 14.6013 1.66675 10.0013C1.66675 5.4013 5.40008 1.66797 10.0001 1.66797C14.6001 1.66797 18.3334 5.4013 18.3334 10.0013Z"
          stroke="#444445"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.0907 12.6495L10.5073 11.1078C10.0573 10.8411 9.69067 10.1995 9.69067 9.67448V6.25781"
          stroke="#444445"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

ClockIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
