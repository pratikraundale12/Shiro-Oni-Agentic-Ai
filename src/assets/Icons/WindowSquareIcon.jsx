import React from 'react';
import PropTypes from 'prop-types';

export const WindowSquareIcon = ({ width = 80, height = 80 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill="#52CF84"
      d="M57.045 28.524h22.954V51.48H57.045V28.524ZM57.045 80.002h22.954V57.046H57.045v22.956Zm8.694-19.12h5.568v4.857h4.856v5.568h-4.856v4.856h-5.568v-4.856h-4.856v-5.568h4.856v-4.857ZM28.523 28.524V51.48h22.956V28.524H28.523Zm14.261 19.118h-5.567v-4.857H32.36v-5.567h4.857V32.36h5.567v4.857h4.857v5.567h-4.857v4.857ZM0 28.524h22.954V51.48H0V28.524ZM22.954 57.045H0v22.957h22.954V57.046Zm-8.692 19.118H8.694v-4.856H3.838v-5.568h4.856v-4.857h5.568v4.857h4.857v5.568h-4.857v4.856ZM28.523 57.045v22.957h22.956V57.046H28.523Zm14.261 19.118h-5.567v-4.856H32.36v-5.568h4.857v-4.857h5.567v4.857h4.857v5.568h-4.857v4.856ZM0 0h22.954v22.956H0V0ZM57.045 0h22.954v22.956H57.045V0ZM28.523 0h22.956v22.956H28.523V0Z"
    />
  </svg>
);

WindowSquareIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
