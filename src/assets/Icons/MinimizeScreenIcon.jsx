import React from 'react';
import PropTypes from 'prop-types';

export function MinimizeScreenIcon({
  width = 36,
  height = 36,
  color = '#313131',
  ...rest
}) {
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
        d="M11 18H25"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
      />
    </svg>
  );
}

MinimizeScreenIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
