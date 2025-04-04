import React from 'react';
import PropTypes from 'prop-types';

export const EmailSmsTrackingIcon = ({ height = 20, width = 20, ...rest }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          d="M1.66675 7.08464C1.66675 4.16797 3.33341 2.91797 5.83341 2.91797H14.1667C16.6667 2.91797 18.3334 4.16797 18.3334 7.08464V12.918C18.3334 15.8346 16.6667 17.0846 14.1667 17.0846H5.83341"
          stroke="#444445"
          strokeWidth="1.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.1666 7.5L11.5582 9.58333C10.6999 10.2667 9.29158 10.2667 8.43325 9.58333L5.83325 7.5"
          stroke="#444445"
          strokeWidth="1.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.66675 13.75H6.66675"
          stroke="#444445"
          strokeWidth="1.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.66675 10.418H4.16675"
          stroke="#444445"
          strokeWidth="1.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

EmailSmsTrackingIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
