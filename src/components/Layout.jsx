import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ChatBoxIcon, KsolvesDataFlowIcon } from '../assets';
import { VERSION } from '../utils';
// import RightSectionImg from '../assets/Image/aside.png';
// import Right from "../assets/Image/rightsection"

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
  justify-content: end;
  flex-direction: column;
  background-color: ${props => props.theme.colors.white};
`;

const RightSection = styled.div`
  width: 50vw;
  height: 100vh;
  background-image: url(${'../assets/Image/right-back.png'});
  background-repeat: no-repeat;
  background-size: 100% 100%;
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

const Version = styled.div`
  margin: 1.8rem 0;
`;

export const Layout = ({ children, newLogin = false }) => {
  newLogin;
  return (
    <Container>
      <LeftSection>
        <KsolvesDataFlowIcon />

        <Content>{children}</Content>
        <Version>{VERSION}</Version>
      </LeftSection>
      {/* {newLogin ? (
        <img src={RightSectionImg} alt="img" />
      ) : ( */}
      <RightSection>{<Image />}</RightSection>
      {/* )} */}
      <ChatBoxContainer>
        <ChatBoxIcon />
      </ChatBoxContainer>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  newLogin: PropTypes.bool,
};
