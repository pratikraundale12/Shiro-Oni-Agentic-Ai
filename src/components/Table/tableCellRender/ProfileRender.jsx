import React from 'react';
import styled from 'styled-components';
import { ProfileIcon } from '../../../assets/Icons';

const UserImgContainer = styled.div`
  border-radius: 100%;
  border: 1px solid var(--col-D7D7D7);
  min-height: 50px;
  height: 50px;
  max-height: 50px;
  min-width: 50px;
  width: 50px;
  max-width: 50px;
`;

export const ProfileRender = () => {
  return (
    <UserImgContainer>
      <ProfileIcon />
    </UserImgContainer>
  );
};
