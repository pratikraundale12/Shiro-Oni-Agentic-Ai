import React from 'react';
import PropTypes from 'prop-types';

export const MailIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 20"
    {...rest}
  >
    <path
      fill={color}
      d="M1 0h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Zm17 4.238-7.928 7.1L2 4.216V16h16V4.238ZM2.511 2l7.55 6.662L17.502 2H2.511Z"
    />
  </svg>
);

MailIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
