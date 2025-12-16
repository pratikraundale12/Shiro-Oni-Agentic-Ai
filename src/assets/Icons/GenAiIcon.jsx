import React from 'react';
import PropTypes from 'prop-types';
export const GenAiIcon = ({ height = 20, width = 20, color = '#444445' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.62143 5.44246C9.88887 4.7197 10.9111 4.7197 11.1786 5.44246L12.9582 10.2517C13.0423 10.479 13.2214 10.6581 13.4486 10.7422L18.2579 12.5218C18.9807 12.7893 18.9807 13.8115 18.2579 14.079L13.4486 15.8586C13.2214 15.9426 13.0423 16.1218 12.9582 16.349L11.1786 21.1583C10.9111 21.8811 9.88887 21.8811 9.62143 21.1583L7.84183 16.349C7.75775 16.1218 7.57859 15.9426 7.35136 15.8586L2.54207 14.079C1.81931 13.8115 1.81931 12.7893 2.54207 12.5218L7.35136 10.7422C7.57859 10.6581 7.75775 10.479 7.84183 10.2517L9.62143 5.44246Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M21.1504 5.39844L16.3504 5.39844"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M18.75 7.79883L18.75 2.99883"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

GenAiIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
