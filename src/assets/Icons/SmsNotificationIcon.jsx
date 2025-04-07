import React from 'react';
import PropTypes from 'prop-types';

export const SmsNotificationIcon = (
  width = 20,
  height = 20,
  color = '#444445'
) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3337 8.7513V12.918C18.3337 15.8346 16.667 17.0846 14.167 17.0846H5.83366C3.33366 17.0846 1.66699 15.8346 1.66699 12.918V7.08464C1.66699 4.16797 3.33366 2.91797 5.83366 2.91797H11.667"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83301 7.5L8.44135 9.58333C9.29968 10.2667 10.708 10.2667 11.5663 9.58333L12.5497 8.8"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2503 6.66667C17.4009 6.66667 18.3337 5.73393 18.3337 4.58333C18.3337 3.43274 17.4009 2.5 16.2503 2.5C15.0997 2.5 14.167 3.43274 14.167 4.58333C14.167 5.73393 15.0997 6.66667 16.2503 6.66667Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

SmsNotificationIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
