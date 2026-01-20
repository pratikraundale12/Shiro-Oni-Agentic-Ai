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
        d="M13.5 14.25H12.6667C12.2246 14.25 11.8007 14.4256 11.4882 14.7382C11.1756 15.0507 11 15.4746 11 15.9167V23.4167C11 23.8587 11.1756 24.2826 11.4882 24.5952C11.8007 24.9077 12.2246 25.0833 12.6667 25.0833H20.1667C20.6087 25.0833 21.0326 24.9077 21.3452 24.5952C21.6577 24.2826 21.8333 23.8587 21.8333 23.4167V22.5833"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9993 12.5833L23.4993 15.0833M24.6535 13.9041C24.9817 13.5759 25.1661 13.1307 25.1661 12.6666C25.1661 12.2024 24.9817 11.7573 24.6535 11.4291C24.3253 11.1009 23.8802 10.9165 23.416 10.9165C22.9519 10.9165 22.5067 11.1009 22.1785 11.4291L15.166 18.4166V20.9166H17.666L24.6535 13.9041Z"
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
