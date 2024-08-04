import React from 'react';
import styled from 'styled-components';

import * as ALL from '../assets';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 1rem;

  span {
    margin-top: 1rem;
  }
`;

const itemsToRender = [];
for (let x in ALL) {
  const Icon = ALL[x];
  itemsToRender.push(
    <IconContainer>
      <Icon />
      <span>{Icon.name}</span>
    </IconContainer>
  );
}

export const Icons = () => {
  return <Container>{itemsToRender}</Container>;
};
