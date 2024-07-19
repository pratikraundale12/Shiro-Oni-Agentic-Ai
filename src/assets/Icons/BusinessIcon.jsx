import React from 'react';
import PropTypes from 'prop-types';

export const BusinessIcon = ({
  width = 21,
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
      d="M4 20.5A3.5 3.5 0 1 1 7.355 16H13v-2h2V8.242L12.757 6H7V8H1V2h6v2h5.757L16 .756 20.243 5 17 8.241V14L19 14v6h-6v-2H7.355A3.502 3.502 0 0 1 4 20.5Zm0-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm13 .5h-2v2h2v-2ZM16 3.586 14.586 5 16 6.414 17.414 5 16 3.586ZM5 4H3v2h2V4Z"
    />
  </svg>
);

BusinessIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
