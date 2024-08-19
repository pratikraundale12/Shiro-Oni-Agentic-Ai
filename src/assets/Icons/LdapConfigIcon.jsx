import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';

export const LdapConfigIcon = ({
  width = 18,
  height = 18,
  color = theme.colors.darker,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M2.33.27a3.5 3.5 0 0 1 4.254 4.963l10.709 10.71-1.414 1.414-10.71-10.71A3.502 3.502 0 0 1 .208 2.393L2.444 4.63a1.5 1.5 0 0 0 2.121-2.121L2.329.27Zm10.367 1.884L15.879.386l1.414 1.415-1.768 3.182-1.768.353-2.12 2.121-1.415-1.414 2.121-2.121.354-1.768Zm-6.718 8.132L7.394 11.7 2.09 17.003a1 1 0 0 1-1.492-1.327l.078-.087 5.303-5.303Z"
    />
  </svg>
);

LdapConfigIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
