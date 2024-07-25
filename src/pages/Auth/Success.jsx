import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { theme } from '../../styles';
import { Layout } from '../../components';
import { Button } from '../../shared';
import {
  ForgetPasswordIcon,
  LessArrowIcon,
  RightInCircleIcon,
} from '../../assets';
import { PASSWORD_CHANGED, SUCCESS_MESSAGE } from '../../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 9rem;
`;

const Title = styled.p`
  font-size: 28px;
  margin-top: 1.4rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: ${props => props.theme.colors.darker};
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-bottom: 2rem;
  font-weight: 500;
  color: ${props => props.theme.colors.darker};
`;

const SubmitButton = styled(Button)`
  padding: 10px 14px;
  border-radius: 8px;

  span {
    margin-top: 2px;
    margin-left: 10px;
  }
`;

export const Success = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Container>
        <RightInCircleIcon width={90} height={90} />
        <ForgetPasswordIcon />
        <Title className="mb-2">{PASSWORD_CHANGED}</Title>
        <SubTitle>{SUCCESS_MESSAGE}</SubTitle>
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </SubmitButton>
      </Container>
    </Layout>
  );
};
