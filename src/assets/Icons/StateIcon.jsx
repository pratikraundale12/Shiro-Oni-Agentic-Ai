import React from 'react';
import PropTypes from 'prop-types';
export const StateIcon = ({ width = 24, height = 24, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.2705 0.908203H10.7296L10.7726 1.62017C11.0191 5.70804 14.2912 8.98017 18.379 9.22675L19.091 9.26967V10.7288L18.379 10.7718C14.2912 11.0183 11.0191 14.2906 10.7726 18.3783L10.7296 19.0903H9.2705L9.2275 18.3783C8.981 14.2906 5.7088 11.0183 1.62115 10.7718L0.90918 10.7288V9.26967L1.62115 9.22675C5.7088 8.98017 8.981 5.70804 9.2275 1.62017L9.2705 0.908203ZM10.0001 4.87428C9.02516 7.17864 7.17943 9.02442 4.87513 9.99925C7.17943 10.9742 9.02516 12.8199 10.0001 15.1243C10.9749 12.8199 12.8207 10.9742 15.125 9.99925C12.8207 9.02442 10.9749 7.17864 10.0001 4.87428Z"
      fill={color}
    />
  </svg>
);
StateIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
