import React from 'react';
import PropTypes from 'prop-types';

export const FlowValidationIcon = ({
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
      d="M16.6667 11.6666C17.5871 11.6666 18.3333 10.9204 18.3333 9.99992C18.3333 9.07944 17.5871 8.33325 16.6667 8.33325C15.7462 8.33325 15 9.07944 15 9.99992C15 10.9204 15.7462 11.6666 16.6667 11.6666Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.6667 5.00008C17.5871 5.00008 18.3333 4.25389 18.3333 3.33341C18.3333 2.41294 17.5871 1.66675 16.6667 1.66675C15.7462 1.66675 15 2.41294 15 3.33341C15 4.25389 15.7462 5.00008 16.6667 5.00008Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.6667 18.3333C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667C18.3333 15.7462 17.5871 15 16.6667 15C15.7462 15 15 15.7462 15 16.6667C15 17.5871 15.7462 18.3333 16.6667 18.3333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33268 11.6666C4.25316 11.6666 4.99935 10.9204 4.99935 9.99992C4.99935 9.07944 4.25316 8.33325 3.33268 8.33325C2.41221 8.33325 1.66602 9.07944 1.66602 9.99992C1.66602 10.9204 2.41221 11.6666 3.33268 11.6666Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10H15"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.9993 3.33325H11.666C9.99935 3.33325 9.16602 4.16659 9.16602 5.83325V14.1666C9.16602 15.8333 9.99935 16.6666 11.666 16.6666H14.9993"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

FlowValidationIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
