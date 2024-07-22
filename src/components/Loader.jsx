import React from 'react';
import styled from 'styled-components';

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  position: relative;
  animation: rotate 1s linear infinite;

  &::before,
  &::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 4px solid #fff;
    animation: prixClipFix 2s linear infinite;
  }

  &::after {
    transform: rotate3d(90, 90, 0, 180deg);
    border-color: ${props => props.theme.colors.primary};
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes prixClipFix {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    75%,
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90%;
  background-color: ${props => props.theme.colors.lightGrey};
`;

export const Loader = () => (
  <LoaderContainer>
    <Spinner />
  </LoaderContainer>
);
