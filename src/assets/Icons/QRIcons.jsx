import React from 'react';
import PropTypes from 'prop-types';

export const QRIcons = ({ width = 20, height = 18, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M19.008 0c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H.992A.993.993 0 0 1 0 17.007V.993A1 1 0 0 1 .992 0h18.016ZM18 2H2v14h16V2Zm-2 10v2H4v-2h12Zm-6-8v6H4V4h6Zm6 4v2h-4V8h4ZM8 6H6v2h2V6Zm8-2v2h-4V4h4Z"
    />
  </svg>
);

QRIcons.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
