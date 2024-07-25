import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const FloatingAlertBox = styled.div`
  border: 3px solid #f3c652;
  border-radius: 8px;
  background-color: #efefa0;
  font-weight: 600;
  top: 25px;
  left: 271px;
  width: calc(100vw - 300px) !important;
  padding: 16px;

  @media screen and (max-width: 991px) {
    left: 100px;
    width: calc(100vw - 130px) !important;
  }
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AlertText = styled.span`
  // Additional styles can be added here if needed
`;

const IconContainer = styled.div`
  margin-left: 16px;
  cursor: pointer;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const SessionExpiredLabel = ({ closeTab }) => {
  return (
    <Container>
      <FloatingAlertBox>
        <AlertContent>
          <AlertText>Your session will expire within 7 days.</AlertText>
          <IconContainer onClick={closeTab}>
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16.5"
                cy="16.5"
                r="16"
                fill="white"
                stroke="#DDE4F0"
              />
              <path
                d="M15.1953 16.1381L10 10.9428L10.9428 10L16.1381 15.1952L21.3334 10L22.2762 10.9428L17.0809 16.1381L22.2762 21.3333L21.3334 22.2762L16.1381 17.0809L10.9428 22.2762L10 21.3333L15.1953 16.1381Z"
                fill="black"
              />
            </svg>
          </IconContainer>
        </AlertContent>
      </FloatingAlertBox>
    </Container>
  );
};

export default SessionExpiredLabel;

SessionExpiredLabel.propTypes = {
  closeTab: PropTypes.func,
};
