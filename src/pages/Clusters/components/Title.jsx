/*eslint-disable*/

import React from 'react';
import styled from 'styled-components';
import { TodoIcon } from '../../../assets';

const Container = styled.div`
  margin-bottom: 1rem !important;
  align-items: center !important;
  justify-content: space-between !important;
  display: flex !important;
`;

const PageHeading = styled.div`
  gap: 10px;
  align-items: center !important;
  display: flex !important;
  p {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

export const Title = ({ title }) => {
  return (
    <Container>
      <PageHeading>
        <div>
          <TodoIcon height="22" width="27" />
        </div>
        <p>{title}</p>
      </PageHeading>
    </Container>
  );
};
