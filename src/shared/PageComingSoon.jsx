import React from 'react';
import styled from 'styled-components';
import { LessArrowIcon, PageComingSoonIcon } from '../assets';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../utils';
import { theme } from '../styles';
import PropTypes from 'prop-types';

const Container = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const PageDisplay = styled.div`
  font-family: Noto Sans;
  font-size: 48px;
  font-weight: 600;
  line-height: 65.38px;
  text-align: center;
  color: #444444;
  margin-bottom: 30px;
`;

const LowerText = styled.div`
  font-family: Noto Sans;
  font-size: 64px;
  font-weight: 600;
  line-height: 87.17px;
  text-align: center;
  color: #444444;
  margin-top: 30px;
`;

const ButtonContainer = styled.div`
  width: 320px;
  margin-top: 40px;
`;
const StyledButton = styled(Button)`
  font-family: Noto Sans;
  font-size: 18px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
`;

export const PageComingSoon = ({ pageTitle = '' }) => {
  const navigate = useNavigate();
  const { setState } = useGlobalContext();

  return (
    <Container>
      <PageDisplay>{pageTitle}</PageDisplay>
      <div>
        <PageComingSoonIcon />
      </div>
      <LowerText>Coming Soon!!</LowerText>
      <ButtonContainer>
        <StyledButton
          onClick={() => {
            navigate('/dashboard');
            setState(prev => ({ ...prev, activeRoute: 'dashboard' }));
          }}
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
        >
          Go Back to Dashboard
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

PageComingSoon.propTypes = {
  pageTitle: PropTypes.string,
};
