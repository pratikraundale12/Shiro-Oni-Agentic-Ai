import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { KDFM } from '../constants';
import { theme } from '../styles';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1em;
  background-color: ${props => props.theme.colors.lightBackground};
  z-index: 9999;
`;

const Loader = styled.img`
  width: 10rem;
  height: 10rem;
`;

const Text = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${theme.colors.darker};
`;

export const FullPageLoader = ({ loading, restartText = false, ...props }) => {
  if (!loading) return null;
  return (
    <Container {...props}>
      <Loader src={loader} alt="loader" />
      <Text>{restartText ? 'Restarting...' : KDFM.LOADING}</Text>
    </Container>
  );
};

FullPageLoader.propTypes = {
  loading: PropTypes.bool,
  restartText: PropTypes.bool,
};
