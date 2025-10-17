import PropTypes from 'prop-types';
import React from 'react';

export const CopyIcon = ({ width = 20, height = 20, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.7132 9.55475V12.3548C10.7132 14.6881 9.77988 15.6214 7.44655 15.6214H4.64655C2.31322 15.6214 1.37988 14.6881 1.37988 12.3548V9.55475C1.37988 7.22142 2.31322 6.28809 4.64655 6.28809H7.44655C9.77988 6.28809 10.7132 7.22142 10.7132 9.55475Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.7132 5.55475V8.35475C14.7132 10.6881 13.7799 11.6214 11.4465 11.6214H10.7132V9.55475C10.7132 7.22142 9.77988 6.28809 7.44655 6.28809H5.37988V5.55475C5.37988 3.22142 6.31322 2.28809 8.64655 2.28809H11.4465C13.7799 2.28809 14.7132 3.22142 14.7132 5.55475Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CopyIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
