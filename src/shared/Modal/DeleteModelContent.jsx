import React from 'react';
import { DeleteDustbinIcon } from '../../assets';
import styled from 'styled-components';

const Container = styled.div`
  // margin-top: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 24px;
`;
const HightedText = styled.h5`
  font-family: 'Noto Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const NormalText = styled.p`
  font-family: 'Noto Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 20px;
`;
const DeleteModalContent = () => {
  return (
    <Container>
      <IconWrapper>
        <DeleteDustbinIcon />
      </IconWrapper>

      <HightedText className="pt-4 mt-2 mb-0 text-center">
        Are you sure you want to delete this user?
      </HightedText>
      <NormalText>It will Temporary remove the user</NormalText>
    </Container>
  );
};
export default DeleteModalContent;
