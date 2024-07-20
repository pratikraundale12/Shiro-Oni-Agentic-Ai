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
      <IconWrapper data-bs-toggle="modal" data-bs-target="#exampleModaltwo">
        <PencilIcon />
      </IconWrapper>
      <IconWrapper data-bs-toggle="modal" data-bs-target="#exampleModal">
        <DeleteSmallIcon color="red" />
      </IconWrapper>
    </ActionTd>
  );
};
