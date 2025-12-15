import React from 'react';
import PropTypes from 'prop-types';

export const MaximizeModalIcon = ({
  width = 18,
  height = 18,
  color = '#484848',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_348_16938)">
      <path
        d="M17.7891 13.0227V17.7688H13.043L14.9189 15.8929L11.3614 12.3358L12.356 11.3416L15.9131 14.8987L17.7891 13.0227ZM5.64398 11.3416L2.08687 14.8987L0.210938 13.0227V17.7688H4.95703L3.08145 15.8932L6.63855 12.3358L5.64398 11.3416ZM13.043 0.23114L14.9189 2.10708L11.3614 5.66419L12.356 6.65841L15.9131 3.1013L17.7891 4.97723V0.23114H13.043ZM4.95703 0.23114H0.210938V4.97723L2.08687 3.1013L5.64398 6.65841L6.63855 5.66419L3.08145 2.10708L4.95703 0.23114Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_348_16938">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

MaximizeModalIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
