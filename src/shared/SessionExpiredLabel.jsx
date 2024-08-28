import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { CrossIcon } from '../assets';
import { KDFM, LICENSE_TYPE } from '../constants';
import { AuthenticationSelectors } from '../store';

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
  position: fixed;
  z-index: 10;
`;

const SessionExpiredLabel = ({ closeTab }) => {
  const { licenseExpireDate, licenseType } = useSelector(
    AuthenticationSelectors.getLicense
  );

  const promptMessage = {
    [LICENSE_TYPE.TRIAL]: KDFM.TRIAL_EXPIRED_PROMPT(licenseExpireDate),
    [LICENSE_TYPE.PURCHASED]: KDFM.PURCHASED_EXPIRED_PROMPT(licenseExpireDate),
  };

  return (
    <Container>
      <FloatingAlertBox>
        <AlertContent>
          <AlertText>
            {promptMessage[licenseType] || promptMessage[LICENSE_TYPE.TRIAL]}
          </AlertText>
          <IconContainer onClick={closeTab}>
            <CrossIcon width={24} height={24} />
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
