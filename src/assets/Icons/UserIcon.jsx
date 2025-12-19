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
        d="M10.1341 9.05866C10.0508 9.05033 9.95078 9.05033 9.85911 9.05866C7.87578 8.99199 6.30078 7.36699 6.30078 5.36699C6.30078 3.32533 7.95078 1.66699 10.0008 1.66699C12.0424 1.66699 13.7008 3.32533 13.7008 5.36699C13.6924 7.36699 12.1174 8.99199 10.1341 9.05866Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.96758 12.133C3.95091 13.483 3.95091 15.683 5.96758 17.0247C8.25924 18.558 12.0176 18.558 14.3092 17.0247C16.3259 15.6747 16.3259 13.4747 14.3092 12.133C12.0259 10.608 8.26758 10.608 5.96758 12.133Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

UserIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
