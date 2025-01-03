import PropTypes from 'prop-types';
import React from 'react';

export const InfoIcon = ({ width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99935 18.3337C5.39697 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39697 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337ZM9.16602 9.16699V14.167H10.8327V9.16699H9.16602ZM9.16602 5.83366V7.50033H10.8327V5.83366H9.16602Z"
      fill="#6d727b"
    />
  </svg>
);

InfoIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
