import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { KsolvesDataFlowIcon } from '../assets';
import { ALREADY_HAVE_AN_ACCOUNT, SIGN_IN } from '../constants';
import { history } from '../helpers/history';
import { TextButton } from '../shared';
import { SettingsActions, SettingsSelectors } from '../store/settings';

const Container = styled.div`
  max-height: 100vh;
  min-height: 100vh;
  padding: 30px;
  background-color: #e3edf3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  flex: 1;
  margin-top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  flex-direction: column;
  background-color: ${props => props.theme.colors.white};
  position: relative;
  box-sizing: border-box;
`;

const RightSection = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1000px;
  position: relative;
  height: 650px;
  border-radius: 32px;
  background-color: #fff7ed;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-top: 0px;
  padding: 10px;
  margin-bottom: 0;

  .graphic-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }
`;

const RightSectionreset = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1000px;
  position: relative;
  height: auto;
  min-height: 700px;
  height: auto;
  border-radius: 32px;
  background-color: #fff7ed;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-top: 0px;
  padding: 10px;
  margin-bottom: 0;

  .graphic-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }
`;

const Image = styled.div`
  width: 80%;
  height: ${props => props.customHeight};
  background-image: url(${props => props.imageUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin-bottom: 30px;

  /* @media (max-width: 1440px) and (min-width: 992px) {
    background-size: 90%;
  } */
  /* @media (max-width: 1660px) and (min-width: 1441px) {
    background-size: 80%;
  }
  @media (max-width: 1800px) and (min-width: 1661px) {
    background-size: 75%;
  }
  @media (max-width: 1300px) and (max-height: 990px) {
    background-size: 75%;
  } */
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
  height: 65vh;
  background-color: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 32px;
  padding: 25px 32px 32px 32px;
`;

const RedirectionSection = styled.div`
  font-family: 'Noto Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 14px;
  text-align: center;
  color: #ff7a00;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const RedirectionText = styled.button`
  border: none;
  background-color: transparent;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 700;
  line-height: 21.17px;
  text-align: left;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  margin-left: 5px;
`;

// const RightSectionTextContainer = styled.div`
//   /* position: absolute;
//   bottom: 20px;
//   left: 50%;
//   transform: translate(-50%, 0);
//   width: 100%;
//   text-align: center; */
// `;

const HeadingRightText = styled.h1`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  margin-top: 0px;
  white-space: pre-line;
`;

const SignInContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  button {
    color: ${props => props.theme.colors.primary};
    font-size: 16px;
    font-weight: 700;
    margin-left: 5px;
    text-decoration: none;
  }
`;

const PolicyContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
  margin-top: auto;
  margin-bottom: 10px;
`;

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Wrapper = styled.div`
  border-radius: 32px;
  background-color: #ffff;
  padding: 22px;
  height: 92vh; /* Full viewport height */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1750px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0px 0px 20px 0px rgba(87, 75, 75, 0.25);
`;

const StyledLoginBox = styled.div`
  width: 158px;
  height: 55px;
  border-radius: 10px;
  border: 1px solid #ff7a00;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const ForgotResetHeadingText1 = styled.h1`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 39.69px;
  text-align: center;
  color: ##333333;
  margin-bottom: 20px;
  margin-top: 20px;
  white-space: pre-line;
`;

const ForgotResetHeadingText2 = styled.h1`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 26.46px;
  text-align: center;
  color: #757575;
  margin-top: 0px;
  margin-bottom: 40px;
  white-space: pre-line;
`;
export const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = history.location.pathname;
  const isUserLogin = pathname === '/login';
  const isAdminLogin = pathname === '/admin/login';
  const isForgotPassword = pathname === '/forgot';
  const isReset = pathname === '/reset';
  const settingsData = useSelector(SettingsSelectors.getSettings);
  let image = settingsData?.logo;

  let imageUrl;
  let customHeight;
  let policyContainerHeight;

  if (isUserLogin || isAdminLogin) {
    imageUrl = '/img/login.png';
    customHeight = '60%';
    policyContainerHeight = '12px';
  } else if (isForgotPassword) {
    imageUrl = '/img/forget.png';
    customHeight = '80%';
    policyContainerHeight = '12px';
  } else if (isReset) {
    imageUrl = '/img/reset.png';
    customHeight = '60%';
    policyContainerHeight = '12px';
  }
  const handleRedirection = () => {
    if (isUserLogin) {
      history.push('/admin/login');
    } else if (isAdminLogin) {
      history.push('/login');
    }
  };

  // let headingText = '';
  // if (isUserLogin) {
  //   headingText = 'Check out the Best Data \n Flow Management Tool!';
  // } else if (isForgotPassword) {
  //   headingText =
  //     'Trouble Logging In? \n If you’ve forgotten your password, we can help you recover access to your account.';
  // } else if (isReset) {
  //   headingText =
  //     'Trouble Logging In? \n If you’ve forgotten your password, we can help you recover access to your account.';
  // }

  useEffect(() => {
    dispatch(SettingsActions.fetchSettings());
  }, [dispatch]);

  return (
    <Container>
      <Wrapper>
        <div className="row">
          <LeftSection>
            {!image ? (
              <KsolvesDataFlowIcon width={160} height={110} />
            ) : (
              <img src={image} alt="Logo" width={200} height={80} />
            )}
            <Content>{children}</Content>
            {(isUserLogin || isAdminLogin) && (
              <StyledLoginBox onClick={handleRedirection}>
                <RedirectionSection>
                  Login via
                  <RedirectionText>
                    {isUserLogin ? 'Admin' : 'User'}
                  </RedirectionText>
                </RedirectionSection>
              </StyledLoginBox>
            )}
            {(isForgotPassword || isReset) && (
              <SignInContainer>
                {ALREADY_HAVE_AN_ACCOUNT}
                <TextButton onClick={() => history.replace('/login')}>
                  {SIGN_IN}
                </TextButton>
              </SignInContainer>
            )}
          </LeftSection>
          <RightWrapper className="col-xl-7 col-lg-7 d-none d-lg-flex flex-column">
            {isUserLogin || isAdminLogin ? (
              <RightSection>
                {(isUserLogin || isAdminLogin) && (
                  <HeadingRightText>
                    Check out the Best Data <br /> Flow Management Tool!
                  </HeadingRightText>
                )}
                {(isForgotPassword || isReset) && (
                  <>
                    <ForgotResetHeadingText1>
                      Trouble Logging In?
                    </ForgotResetHeadingText1>
                    <ForgotResetHeadingText2>
                      If you’ve forgotten your password, we can help you <br />
                      recover access to your account.
                    </ForgotResetHeadingText2>
                  </>
                )}
                <Image imageUrl={imageUrl} customHeight={customHeight} />
                <PolicyContainer customHeight={policyContainerHeight}>
                  <RedirectionText
                    onClick={() => history.push('/policy/privacy-policy')}
                  >
                    Privacy Policy
                  </RedirectionText>
                  <div>|</div>
                  <RedirectionText
                    onClick={() => history.push('/policy/terms-of-use')}
                  >
                    Terms Of Use
                  </RedirectionText>
                </PolicyContainer>
                <LabelSelect>version 1.5.7</LabelSelect>
              </RightSection>
            ) : (
              <RightSectionreset>
                {(isForgotPassword || isReset) && (
                  <>
                    <ForgotResetHeadingText1>
                      Trouble Logging In?
                    </ForgotResetHeadingText1>
                    <ForgotResetHeadingText2>
                      If you’ve forgotten your password, we can help you <br />
                      recover access to your account.
                    </ForgotResetHeadingText2>
                  </>
                )}
                <Image imageUrl={imageUrl} customHeight={customHeight} />
                <PolicyContainer customHeight={policyContainerHeight}>
                  <RedirectionText
                    onClick={() => history.push('/policy/privacy-policy')}
                  >
                    Privacy Policy
                  </RedirectionText>
                  <div>|</div>
                  <RedirectionText
                    onClick={() => history.push('/policy/terms-of-use')}
                  >
                    Terms Of Use
                  </RedirectionText>
                </PolicyContainer>
                <LabelSelect>version 1.5.7</LabelSelect>
              </RightSectionreset>
            )}
          </RightWrapper>
        </div>
      </Wrapper>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
