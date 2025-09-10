import PropTypes from 'prop-types';
import React from 'react';
export const RefrenceIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4476 11.1597V3.11305C15.4476 2.31305 14.7943 1.71972 14.0009 1.78639H13.9609C12.5609 1.90639 10.4343 2.61972 9.24759 3.36639L9.13426 3.43972C8.94092 3.55972 8.62092 3.55972 8.42759 3.43972L8.26092 3.33972C7.07426 2.59972 4.95426 1.89305 3.55426 1.77972C2.76092 1.71305 2.11426 2.31305 2.11426 3.10639V11.1597C2.11426 11.7997 2.63426 12.3997 3.27426 12.4797L3.46759 12.5064C4.91426 12.6997 7.14759 13.4331 8.42759 14.1331L8.45426 14.1464C8.63426 14.2464 8.92092 14.2464 9.09426 14.1464C10.3743 13.4397 12.6143 12.6997 14.0676 12.5064L14.2876 12.4797C14.9276 12.3997 15.4476 11.7997 15.4476 11.1597Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.78125 3.66016V13.6602"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.94824 5.66016H4.44824"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.44824 7.66016H4.44824"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

RefrenceIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
