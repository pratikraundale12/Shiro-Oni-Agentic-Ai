import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
  width: 100%;
  padding: 2.6rem;
`;

const Title = styled.h1`
  font-weight: 600;
  color: ${props => props.theme.colors.black};
`;

export const Header = ({ title }) => {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
};
