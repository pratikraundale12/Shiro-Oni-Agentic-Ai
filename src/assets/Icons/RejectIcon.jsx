import React from 'react';
import PropTypes from 'prop-types';

export const RejectIcon = ({
  height = 18,
  width = 18,
  stroke = '#FF0000',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M9.933 1.83325H6.06635C5.61301 1.83325 4.97301 2.09992 4.65301 2.41992L1.91968 5.15326C1.59968 5.47326 1.33301 6.11326 1.33301 6.56659V10.4332C1.33301 10.8866 1.59968 11.5266 1.91968 11.8466L4.65301 14.5799C4.97301 14.8999 5.61301 15.1666 6.06635 15.1666H9.933C10.3863 15.1666 11.0263 14.8999 11.3463 14.5799L14.0797 11.8466C14.3997 11.5266 14.6663 10.8866 14.6663 10.4332V6.56659C14.6663 6.11326 14.3997 5.47326 14.0797 5.15326L11.3463 2.41992C11.0263 2.09992 10.3863 1.83325 9.933 1.83325Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.29395 13.2204L12.7206 3.7937"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RejectIcon.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stroke: PropTypes.string,
};
