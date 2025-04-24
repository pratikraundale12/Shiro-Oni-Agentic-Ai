import React from 'react';
import PropTypes from 'prop-types';

export const FullScreenIcon = ({
  width = 24,
  height = 24,
  color = '#444445',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M8.46908 19.276H13.4691C17.6357 19.276 19.3024 17.6094 19.3024 13.4427V8.44271C19.3024 4.27604 17.6357 2.60937 13.4691 2.60937H8.46908C4.30241 2.60938 2.63574 4.27604 2.63574 8.44271V13.4427C2.63574 17.6094 4.30241 19.276 8.46908 19.276Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.9687 5.94141L5.96875 15.9414"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.9691 9.27474V5.94141H12.6357"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.96875 12.6094V15.9427H9.30208"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

FullScreenIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
