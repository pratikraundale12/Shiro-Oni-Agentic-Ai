import React from 'react';
import PropTypes from 'prop-types';

export const SendMessageIcon = ({
  width = 21,
  height = 21,
  color = '#444443',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.7267 0.958529L15.2734 20.0448C15.1225 20.5732 14.7979 20.5972 14.5563 20.1142L10 11.0016L0.922902 7.37078C0.413223 7.16691 0.419533 6.86181 0.956952 6.68267L20.0432 0.320599C20.5716 0.144439 20.8747 0.440249 20.7267 0.958529ZM18.0353 3.09806L5.81221 7.17244L11.4488 9.42709L14.4895 15.5084L18.0353 3.09806Z"
      fill={color}
    />
  </svg>
);

SendMessageIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
