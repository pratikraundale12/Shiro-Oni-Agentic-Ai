import React from 'react';
import PropTypes from 'prop-types';
export const NewChatIcon = ({
  width = 36,
  height = 36,
  color = '#313131',
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M27 16.2439V14C27 11.7909 25.2091 10 23 10H15C12.7909 10 11 11.7909 11 14V26L14.3488 22.4878H19.5581"
        stroke={color}
        strokeWidth={1.67}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.0234 17.4147V23.6586"
        stroke={color}
        strokeWidth={1.67}
        strokeLinecap="round"
      />
      <path
        d="M27 20.5366L21.0465 20.5366"
        stroke={color}
        strokeWidth={1.67}
        strokeLinecap="round"
      />
    </svg>
  );
};

NewChatIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
