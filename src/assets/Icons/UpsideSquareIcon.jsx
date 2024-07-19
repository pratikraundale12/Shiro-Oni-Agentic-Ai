import React from 'react';
import PropTypes from 'prop-types';

export const UpsideSquareIcon = ({
  width = 18,
  height = 21,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M15 14v-2h1V2H3v10.035c.163-.023.33-.035.5-.035H5v2H3.5a1.5 1.5 0 0 0 0 3H7v2H3.5A3.5 3.5 0 0 1 0 15.5V3a3 3 0 0 1 3-3h14a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1h-4v-2h3v-3h-1ZM4 3h2v2H4V3Zm0 3h2v2H4V6Zm7 9v6H9v-6H6l4-5 4 5h-3Z"
    />
  </svg>
);

UpsideSquareIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
