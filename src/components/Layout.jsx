import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ChatBoxIcon, KsolvesDataFlowIcon } from '../assets';
import { VERSION } from '../utils';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: ${props => props.theme.colors.lighter};
`;

const LeftSection = styled.div`
  width: 50vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${props => props.theme.colors.white};
`;

const RightSection = styled.div`
  width: 50vw;
  height: 100vh;
  background-image: url('/img/right-back.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
`;

const Image = styled.div`
  width: 50vw;
  height: 100vh;
  background-image: url('/img/right-logo.png');
  background-repeat: no-repeat;
  background-position: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 55%;
  height: 70%;
  background-color: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-top: 20px;
`;

const ChatBoxContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const RedirectionSection = styled.div`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 500;
  line-height: 21.17px;
  text-align: left;
  color: #757575;
  margin-top: 14px;
`;

const RedirectionText = styled.button`
  border: none;
  background-color: transparent;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 700;
  line-height: 21.17px;
  text-align: left;
  color: #ff7a00;
  cursor: pointer;
`;

const RightSectionTextContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
`;
const VersionRightText = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 21.17px;
  text-align: center;
  color: #757575;
`;
const HeadingRightText = styled.p`
  font-family: Red Hat Display;
  font-size: 36px;
  font-weight: 700;
  line-height: 47.63px;
  letter-spacing: 0.08em;
  text-align: center;
`;

export const Layout = ({ children, userLogin = false }) => {
  const navigate = useNavigate();
  userLogin;
  return (
    <Container>
      <LeftSection>
        <KsolvesDataFlowIcon />

        <Content>{children}</Content>
        <RedirectionSection>
          Login via{' '}
          <RedirectionText
            onClick={() => navigate(userLogin ? '/admin/login' : '/login')}
          >
            {userLogin ? 'Admin' : 'User'}
          </RedirectionText>
        </RedirectionSection>
        {/* */}
      </LeftSection>
      <RightSection>
        <RightSectionTextContainer>
          {' '}
          <HeadingRightText>
            Check out the Best Data <br /> Flow Management Tool!
          </HeadingRightText>
          <br />
          <VersionRightText>{VERSION}</VersionRightText>{' '}
        </RightSectionTextContainer>{' '}
        {<Image />}
      </RightSection>
      <ChatBoxContainer>
        <ChatBoxIcon />
      </ChatBoxContainer>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  userLogin: PropTypes.bool,
};
