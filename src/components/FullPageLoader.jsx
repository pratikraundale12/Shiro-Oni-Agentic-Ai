import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import loader from '../assets/loader.gif';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.lightBackground};
  z-index: 9999;
`;

const Loader = styled.img`
  width: 360px;
  height: 360px;
`;

export const FullPageLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <Container>
      <Loader src={loader} alt="loader" />
    </Container>
  );
};

FullPageLoader.propTypes = {
  loading: PropTypes.bool,
};
