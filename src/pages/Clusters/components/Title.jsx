import React from 'react';
import PropTypes from 'prop-types';
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

  h3 {
    font-family: ${props => props.theme.fontNato};
    font-size: 18px;
    font-weight: 500;
    margin: 0;
  }
`;

export const Title = ({ title }) => {
  return (
    <Container>
      <PageHeading>
        <TodoIcon width={22} height={24} />
        <h3>{title}</h3>
      </PageHeading>
    </Container>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};
