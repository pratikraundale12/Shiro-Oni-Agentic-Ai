import React from 'react';
import PropTypes from 'prop-types';

export const DownloadIcon = ({
  width = 20,
  height = 20,
  color = '#FFFFFF',
}) => (
  <svg
    style={{ margin: '0' }}
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.8334 8.33333H15.0001L10.0001 13.3333L5.00008 8.33333H9.16675V2.5H10.8334V8.33333ZM3.33341 15.8333H16.6667V10H18.3334V16.6667C18.3334 17.1269 17.9603 17.5 17.5001 17.5H2.50008C2.03985 17.5 1.66675 17.1269 1.66675 16.6667V10H3.33341V15.8333Z"
      fill={color}
    />
  </svg>
);

DownloadIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
