import PropTypes from 'prop-types';
import React from 'react';
import { theme } from '../../styles';

export const NewLockIcon = ({
  width = 22,
  height = 22,
  color = theme.colors.darker,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8274 6.22609H12.4499C12.7937 6.22609 13.0724 6.50479 13.0724 6.84859V13.0736C13.0724 13.4174 12.7937 13.6961 12.4499 13.6961H2.48993C2.14614 13.6961 1.86743 13.4174 1.86743 13.0736V6.84859C1.86743 6.50479 2.14614 6.22609 2.48993 6.22609H3.11243V5.60359C3.11243 3.19702 5.06335 1.24609 7.46993 1.24609C9.87652 1.24609 11.8274 3.19702 11.8274 5.60359V6.22609ZM3.11243 7.47109V12.4511H11.8274V7.47109H3.11243ZM6.84743 8.71609H8.09243V11.2061H6.84743V8.71609ZM10.5824 6.22609V5.60359C10.5824 3.88461 9.1889 2.49109 7.46993 2.49109C5.75095 2.49109 4.35743 3.88461 4.35743 5.60359V6.22609H10.5824Z"
      fill={color}
    />
  </svg>
);

NewLockIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
