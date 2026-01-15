import React from 'react';
import PropTypes from 'prop-types';

export const NewChatIcon = ({
  width = 36,
  height = 36,
  color = 'white',
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
        d="M13.5 14.2501H12.6667C12.2246 14.2501 11.8007 14.4257 11.4882 14.7382C11.1756 15.0508 11 15.4747 11 15.9167V23.4167C11 23.8588 11.1756 24.2827 11.4882 24.5952C11.8007 24.9078 12.2246 25.0834 12.6667 25.0834H20.1667C20.6087 25.0834 21.0326 24.9078 21.3452 24.5952C21.6577 24.2827 21.8333 23.8588 21.8333 23.4167V22.5834"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9993 12.5834L23.4993 15.0834M24.6535 13.9042C24.9817 13.576 25.1661 13.1309 25.1661 12.6667C25.1661 12.2026 24.9817 11.7574 24.6535 11.4292C24.3253 11.101 23.8802 10.9166 23.416 10.9166C22.9519 10.9166 22.5067 11.101 22.1785 11.4292L15.166 18.4167V20.9167H17.666L24.6535 13.9042Z"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

NewChatIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
