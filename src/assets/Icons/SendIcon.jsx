import React from 'react';
import PropTypes from 'prop-types';

export const SendIcon = ({
  width = 40,
  height = 40,
  color = '#A0A0A0',
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="40" height="40" rx="20" fill={color} />

      <path
        d="M21.7601 26.7265C21.7865 26.7923 21.8324 26.8484 21.8915 26.8873C21.9507 26.9262 22.0204 26.9461 22.0912 26.9443C22.1621 26.9425 22.2306 26.9191 22.2878 26.8772C22.3449 26.8353 22.3878 26.7769 22.4108 26.7099L26.9247 13.5154C26.9469 13.4539 26.9512 13.3873 26.9369 13.3234C26.9227 13.2596 26.8905 13.2011 26.8443 13.1548C26.798 13.1086 26.7396 13.0765 26.6757 13.0622C26.6118 13.048 26.5452 13.0522 26.4837 13.0744L13.2893 17.5883C13.2223 17.6113 13.1639 17.6542 13.122 17.7114C13.0801 17.7685 13.0566 17.8371 13.0548 17.9079C13.053 17.9787 13.0729 18.0484 13.1118 18.1076C13.1507 18.1668 13.2069 18.2126 13.2726 18.239L18.7796 20.4474C18.9536 20.5171 19.1118 20.6213 19.2445 20.7538C19.3772 20.8862 19.4818 21.0442 19.5518 21.2182L21.7601 26.7265Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M26.8433 13.1577L19.2461 20.7542"
        stroke="#FFFFFF"
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

SendIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
