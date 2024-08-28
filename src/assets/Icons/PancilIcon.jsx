import PropTypes from 'prop-types';
import React from 'react';
import { theme } from '../../styles';

export const PencilIcon = ({
  width = 20,
  height = 20,
  color = theme.colors.darker,
}) => (
  <>
    <svg
      width={width}
      height={height}
      viewBox="8 8 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1667 21.7414H11.3452L19.1066 13.98L17.9281 12.8015L10.1667 20.5629V21.7414ZM23.5 23.4081H8.5V19.8725L19.6958 8.67669C20.0213 8.35126 20.5489 8.35126 20.8743 8.67669L23.2314 11.0337C23.5568 11.3592 23.5568 11.8868 23.2314 12.2122L13.7022 21.7414H23.5V23.4081ZM19.1066 11.623L20.2851 12.8015L21.4636 11.623L20.2851 10.4445L19.1066 11.623Z"
        fill={color}
      />
    </svg>
  </>
);

PencilIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
