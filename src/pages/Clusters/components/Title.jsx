import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PlusCircleIcon, PlusIcon, TodoIcon } from '../../../assets';
import { Button } from '../../../shared';

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
    font-size: 20px;
    font-weight: 550;
    margin: 0;
  }
`;

export const Title = ({
  title,
  displayButton = false,
  handleButtonClick = () => {},
}) => {
  return (
    <Container>
      <PageHeading>
        <TodoIcon width={22} height={24} />
        <h3>{title}</h3>
      </PageHeading>
      {displayButton && (
        <div className="col-auto ms-3">
          <Button
            size="md"
            onClick={() => {}}
            className="w-auto px-3"
            style={{ minWidth: 'auto' }}
          >
            <div
              className="d-flex "
              style={{ fontSize: '14px', fontWeight: '750' }}
            >
              <PlusCircleIcon height={19} width={19} color={'#fff'} />
              Add New Config
            </div>
          </Button>
        </div>
      )}
    </Container>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
  displayButton: PropTypes.bool,
  handleButtonClick: PropTypes.func,
};
