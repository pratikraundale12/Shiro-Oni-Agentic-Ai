import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { KsolvesDataFlowIcon } from '../assets';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  padding: 0px 15px;
`;

const LeftSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${props => props.theme.colors.white};
`;

const RightSection = styled.div`
  position: relative;
  height: 100vh;
  background-image: url('/img/aside-background.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  background-color: #fff7ed;
  position: fixed;
  top: 0;
  right: 0;
  p {
    font-weight: 700;
    max-width: 540px;
    margin: 0 auto;
  }
`;
const Image = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-image: url('/img/right-logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 65%;
  @media (max-width: 1440px) and (min-width: 992px) {
    background-size: 90%;
  }
  @media (max-width: 1660px) and (min-width: 1441px) {
    background-size: 80%;
  }
  @media (max-width: 1800px) and (min-width: 1661px) {
    background-size: 75%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 470px;
  width: 100%;
  background-color: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-top: 20px;
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
      <div className="row">
        <LeftSection className="col-xl-5 col-lg-5">
          <KsolvesDataFlowIcon />
          <Content>{children}</Content>
          <RedirectionSection>
            Login via
            <RedirectionText
              onClick={() => navigate(userLogin ? '/admin/login' : '/login')}
            >
              {userLogin ? 'Admin' : 'User'}
            </RedirectionText>
          </RedirectionSection>
        </LeftSection>
        <RightSection className="col-xl-7 col-lg-7 d-none d-lg-inline">
          <RightSectionTextContainer>
            <HeadingRightText>
              Check out the Best Data <br /> Flow Management Tool!
            </HeadingRightText>
            <br />
          </RightSectionTextContainer>
          <Image />
        </RightSection>
      </div>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  userLogin: PropTypes.bool,
};
