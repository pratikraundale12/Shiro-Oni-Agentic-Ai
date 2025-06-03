import * as React from 'react';
import PropTypes from 'prop-types';

export const RefreshIcon = (
  { width = 18, height = 18, color = '#444445' },
  ...props
) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.55222 2.69515C5.01305 1.43204 6.91733 0.667969 9.00008 0.667969C13.6024 0.667969 17.3334 4.39893 17.3334 9.0013C17.3334 10.7814 16.7752 12.4311 15.8244 13.7851L13.1667 9.0013H15.6667C15.6667 5.3194 12.682 2.33464 9.00008 2.33464C7.20826 2.33464 5.58156 3.04153 4.38361 4.19165L3.55222 2.69515ZM14.4479 15.3075C12.9871 16.5706 11.0828 17.3346 9.00008 17.3346C4.39771 17.3346 0.666748 13.6036 0.666748 9.0013C0.666748 7.22119 1.22491 5.57144 2.17575 4.2175L4.83341 9.0013H2.33341C2.33341 12.6832 5.31818 15.668 9.00008 15.668C10.7919 15.668 12.4186 14.9611 13.6166 13.811L14.4479 15.3075Z"
      fill={color}
    />
  </svg>
);

RefreshIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
