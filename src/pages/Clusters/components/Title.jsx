/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { GreaterArrowIcon, PlusCircleIcon, TodoIcon } from '../../../assets';
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
  displayBackButton = false,
  handleBackClick = () => {},
  buttonText = '',
}) => {
  return (
    <Container>
      <PageHeading>
        {displayBackButton ? (
          <span onClick={() => handleBackClick()} style={{ cursor: 'pointer' }}>
            <GreaterArrowIcon />
          </span>
        ) : (
          <TodoIcon width={22} height={24} />
        )}
        <h3>{title}</h3>
      </PageHeading>
      {displayButton && (
        <div className="col-auto ms-3">
          <Button
            size="md"
            onClick={() => handleButtonClick()}
            className="w-auto px-3"
            style={{ minWidth: 'auto' }}
          >
            <div
              className="d-flex "
              style={{ fontSize: '14px', fontWeight: '750' }}
            >
              <PlusCircleIcon height={19} width={19} color={'#fff'} />
              {buttonText}
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
  handleBackClick: PropTypes.func,
  buttonText: PropTypes.string,
};
