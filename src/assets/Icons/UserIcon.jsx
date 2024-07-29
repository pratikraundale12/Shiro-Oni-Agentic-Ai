import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const UserIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33337 18.333C3.33337 14.6511 6.31814 11.6663 10 11.6663C13.682 11.6663 16.6667 14.6511 16.6667 18.333H15C15 15.5716 12.7615 13.333 10 13.333C7.23862 13.333 5.00004 15.5716 5.00004 18.333H3.33337ZM10 10.833C7.23754 10.833 5.00004 8.59551 5.00004 5.83301C5.00004 3.07051 7.23754 0.833008 10 0.833008C12.7625 0.833008 15 3.07051 15 5.83301C15 8.59551 12.7625 10.833 10 10.833ZM10 9.16634C11.8417 9.16634 13.3334 7.67467 13.3334 5.83301C13.3334 3.99134 11.8417 2.49967 10 2.49967C8.15837 2.49967 6.66671 3.99134 6.66671 5.83301C6.66671 7.67467 8.15837 9.16634 10 9.16634Z"
        fill={color}
      />
    </svg>
  );
};

UserIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
