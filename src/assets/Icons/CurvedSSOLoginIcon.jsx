import React from 'react';
import PropTypes from 'prop-types';

export const CurvedSSOLoginIcon = ({
  height = 24,
  width = 24,
  color = '#444445',
}) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.90039 7.55828C9.21039 3.95828 11.0604 2.48828 15.1104 2.48828H15.2404C19.7104 2.48828 21.5004 4.27828 21.5004 8.74828V15.2683C21.5004 19.7383 19.7104 21.5283 15.2404 21.5283H15.1104C11.0904 21.5283 9.24039 20.0783 8.91039 16.5383"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12H14.88"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6504 8.64844L16.0004 11.9984L12.6504 15.3484"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

CurvedSSOLoginIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
