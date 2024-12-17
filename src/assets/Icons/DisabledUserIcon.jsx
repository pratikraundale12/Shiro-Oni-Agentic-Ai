import PropTypes from 'prop-types';
import React from 'react';
import { theme } from '../../styles';

export const DisabledUserIcon = ({ color = theme.colors.darker }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.35743 6.22609H12.4499C12.7937 6.22609 13.0724 6.50479 13.0724 6.84859V13.0736C13.0724 13.4174 12.7937 13.6961 12.4499 13.6961H2.48993C2.14614 13.6961 1.86743 13.4174 1.86743 13.0736V6.84859C1.86743 6.50479 2.14614 6.22609 2.48993 6.22609H3.11243V5.60359C3.11243 3.19702 5.06335 1.24609 7.46993 1.24609C9.17589 1.24609 10.6528 2.22641 11.3683 3.65443L10.2544 4.21134C9.74343 3.19132 8.68848 2.49109 7.46993 2.49109C5.75095 2.49109 4.35743 3.88461 4.35743 5.60359V6.22609ZM3.11243 7.47109V12.4511H11.8274V7.47109H3.11243ZM6.22493 9.33859H8.71493V10.5836H6.22493V9.33859Z"
      fill={color}
    />
  </svg>
);

DisabledUserIcon.propTypes = {
  color: PropTypes.string,
};
