import React from 'react';
import styled from 'styled-components';

const SessionExpiry = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SessionContainer = styled.div`
  max-width: 700px;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const SessionHeaderTitle = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  font-weight: 600;
  font-size: 28px;
  padding: 10px 14px;
  border-radius: 8px 8px 0 0;
  text-align: center;
`;

const TxtContainerDiv = styled.div`
  font-weight: 500;
  font-size: 26px;
  color: ${props => props.theme.colors.darker};
  padding: 36px 20px;
  text-align: center;
`;

export const SessionExpired = () => {
  return (
    <SessionExpiry>
      <SessionContainer>
        <SessionHeaderTitle>License Expired</SessionHeaderTitle>
        <TxtContainerDiv>
          Please contact to Administrator to renew your license and restore
          access.
        </TxtContainerDiv>
      </SessionContainer>
    </SessionExpiry>
  );
};
