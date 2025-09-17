import React from 'react';
import PropTypes from 'prop-types';

export const VariablesIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.0495 8.69968L17.2328 12.183C16.5328 15.1913 15.1495 16.408 12.5495 16.158C12.1328 16.1247 11.6828 16.0497 11.1995 15.933L9.7995 15.5997C6.3245 14.7747 5.2495 13.058 6.06617 9.57468L6.88283 6.08301C7.0495 5.37468 7.2495 4.75801 7.4995 4.24968C8.4745 2.23301 10.1328 1.69135 12.9162 2.34968L14.3078 2.67468C17.7995 3.49135 18.8662 5.21635 18.0495 8.69968Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5493 16.1581C12.0326 16.5081 11.3826 16.7998 10.591 17.0581L9.27431 17.4914C5.96597 18.5581 4.22431 17.6664 3.14931 14.3581L2.08264 11.0664C1.01597 7.75809 1.89931 6.00809 5.20764 4.94142L6.52431 4.50809C6.86597 4.39976 7.19097 4.30809 7.49931 4.24976C7.24931 4.75809 7.04931 5.37476 6.88264 6.08309L6.06597 9.57476C5.24931 13.0581 6.32431 14.7748 9.79931 15.5998L11.1993 15.9331C11.6826 16.0498 12.1326 16.1248 12.5493 16.1581Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5332 7.10864L14.5749 8.13364"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.7168 10.3337L12.1335 10.9504"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

VariablesIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
