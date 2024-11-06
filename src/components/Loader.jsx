import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles';

export const Spinner = styled.div`
  width: ${props => `${props.size || 40}px`};
  height: ${props => `${props.size || 40}px`};
  border: ${props => `${props.size / 10}px`} solid ${props => props.color};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  background-color: transparent;
`;

export const Loader = ({
  size = 'md',
  color = theme.colors.primary,
  ...props
}) => {
  const sizes = {
    sm: 20,
    md: 30,
    lg: 40,
  };

  return (
    <LoaderContainer {...props}>
      <Spinner size={sizes[size]} color={color} />
    </LoaderContainer>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
};
