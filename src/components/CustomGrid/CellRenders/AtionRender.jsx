import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircleExclamationMarkIcon, ThreedotsIcon } from '../../../assets';

// Styled components based on the provided CSS
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
`;

export const IconButton = styled.button`
  min-width: 34px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ActionRender = ({ handleMenuClick, item }) => {
  return (
    <ActionTd>
      <IconButton>
        <CircleExclamationMarkIcon />
      </IconButton>
      <IconButton onClick={event => handleMenuClick(event, item)}>
        <ThreedotsIcon />
      </IconButton>
    </ActionTd>
  );
};

ActionRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
};
