import React from 'react';
import styled from 'styled-components';
import { DeleteSmallIcon, PencilIcon } from '../../../assets';

// Styled components based on the provided CSS
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ActionRender = () => {
  return (
    <ActionTd>
      <IconWrapper>
        <PencilIcon />
      </IconWrapper>
      <IconWrapper>
        <DeleteSmallIcon color="red" />
      </IconWrapper>
    </ActionTd>
  );
};
