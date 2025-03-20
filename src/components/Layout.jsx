import { useKeycloak } from '@react-keycloak/web';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { KsolvesDataFlowIcon, MicroSoftIcon } from '../assets';
import KeycloakIcon from '../assets/Icons/KeycloakIcon';
import { ALREADY_HAVE_AN_ACCOUNT, API_URL, SIGN_IN } from '../constants';
import { changeFavicon, changeTitle } from '../helpers';
import { history } from '../helpers/history';
import { TextButton } from '../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  NamespacesActions,
} from '../store';
import { getAzureLoginUrl } from '../store/apis';
import { SettingsActions, SettingsSelectors } from '../store/settings';
import { FullPageLoader } from './FullPageLoader';

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
  margin-left: auto;
  margin-right: auto;
`;
const ForgotResetHeadingText1 = styled.h1`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 39.69px;
  text-align: center;
  color: #333333;
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

const SmallText = styled.div`
  display: block;
  margin-top: 0.4rem;
  color: ${props => props.theme.colors.darker};
  text-align: center;
  font-size: 16px;
  position: relative;
  &:after {
    content: '';
    width: 80%;
    display: block;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    position: absolute;
    top: 50%;
    margin: auto;
    left: 0;
    right: 0;
  }
  span {
    background-color: #f5f7fa;
    padding: 5px;
    position: relative;
    z-index: 1;
  }
`;

const BtnText = styled.span`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.17px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: ${props => props.theme.colors.darker};
`;

const SSOButtonsContainer = styled.div`
  margin-top: 0.4rem;
`;

const SSOButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 0.9rem 1rem;
  border-radius: 8px;
  // border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.white};
  // box-shadow: 0px 1px 3px ${props => props.theme.colors.shadow};
  box-shadow:
    0px 3px 8px -1px #3232470d,
    0px 0px 1px 0px #0c1a4b3d;
`;

const LoginBtnContainer = styled.div`
  @media (max-width: 768px) {
    width: 82% !important;
  }
  @media (max-width: 1599px) and (min-width: 1478px) {
    width: 77% !important;
  }
  @media (max-width: 1479px) and (min-width: 1300px) {
    width: 80% !important;
  }
  @media (max-width: 1299px) and (min-width: 991px) {
    width: 89% !important;
  }
`;
export const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const pathname = history.location.pathname;
  const isUserLogin = pathname === '/login';
  const isAdminLogin = pathname === '/admin/login';
  const isForgotPassword = pathname === '/forgot';
  const isReset = pathname === '/reset';
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const settingLogo = useSelector(AuthenticationSelectors.getSettingLogo);
  const { keycloak, initialized } = useKeycloak();
  let image = settingsData?.logo || settingLogo?.logo;

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

  useEffect(() => {
    setIsLoading(false);
  }, [history]);

  const handleMSLogin = async () => {
    try {
      setIsLoading(true);
      const response = await getAzureLoginUrl();
      if (response.status !== 200) {
        throw new Error('Failed to continue login with Microsoft');
      } else {
        const msRedirectUrl = response?.data?.authUrl;
        history.push(msRedirectUrl);
      }
    } catch (error) {
      console.error('Azure login Error:', error);
      toast.error(error ? error : 'Failed to continue login with Microsoft');
    }
  };

  useEffect(() => {
    if (
      settingLogo?.show_sso_page &&
      settingLogo?.selected_sso === 'azure' &&
      location.pathname === '/login' &&
      settingLogo?.details_for_sso_exist
    ) {
      handleMSLogin();
    }
  }, [settingLogo]);

  useEffect(() => {
    if (settingLogo?.favicon) {
      changeFavicon(settingLogo?.favicon);
    }
    if (settingLogo?.title) {
      changeTitle(settingLogo.title);
    }
  }, [settingLogo]);
  useEffect(() => {
    if (dispatch && !isEmpty(settingsData)) {
      if (
        location.pathname === '/login' ||
        location.pathname === '/admin/login'
      ) {
        dispatch(AuthenticationActions.fetchSettingLogo());
      } else {
        dispatch(SettingsActions.fetchSettings());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(NamespacesActions.setSelectedCluster({}));
    dispatch(SettingsActions.fetchSettingsSuccess());
  }, [dispatch]);

  const btnStyles = isUserLogin => ({
    width: isUserLogin ? '64%' : 'auto',
  });

  useEffect(() => {
    if (settingLogo?.selected_sso === 'keycloak' && settingLogo?.sso_enabled) {
      dispatch(AuthenticationActions.fetchKeycloakConfig());
    }
  }, [dispatch, settingLogo?.selected_sso]);

  /*
   * use http://localhost:port/keycloakLogin for configuring on local system in development mode
   */
  const handleKeycloakLogin = async () => {
    if (initialized && !keycloak.authenticated) {
      await keycloak.login({ redirectUri: `${API_URL}/keycloakLogin` });
    }
  };

  return (
    <Container>
      <Wrapper>
        <FullPageLoader loading={isLoading} />
        <div className="row">
          <LeftSection>
            {!image ? (
              <KsolvesDataFlowIcon width={160} height={110} />
            ) : (
              <img src={image} alt="Logo" width={200} height={80} />
            )}
            <Content>
              {children}
              {isUserLogin &&
                settingLogo?.selected_sso === 'azure' &&
                !settingLogo?.show_sso_page &&
                settingLogo?.sso_enabled && (
                  <>
                    <SmallText>
                      <span>or</span>
                    </SmallText>
                    <SSOButtonsContainer>
                      <SSOButton onClick={handleMSLogin}>
                        <MicroSoftIcon />
                        <BtnText>Sign in via Microsoft</BtnText>
                      </SSOButton>
                    </SSOButtonsContainer>
                  </>
                )}
              {isUserLogin &&
                settingLogo?.selected_sso === 'keycloak' &&
                !settingLogo?.show_sso_page &&
                settingLogo?.sso_enabled && (
                  <>
                    <SmallText>
                      <span>or</span>
                    </SmallText>{' '}
                    <SSOButtonsContainer>
                      <SSOButton onClick={handleKeycloakLogin}>
                        <KeycloakIcon />
                        <BtnText>Sign in via Keycloak</BtnText>
                      </SSOButton>
                    </SSOButtonsContainer>
                  </>
                )}
            </Content>
            {(isUserLogin || isAdminLogin) && (
              <LoginBtnContainer
                style={btnStyles(isUserLogin)}
                className={`d-flex align-items-center justify-content-between`}
              >
                <StyledLoginBox onClick={handleRedirection}>
                  <RedirectionSection>
                    <RedirectionText>
                      Login via &nbsp;
                      {isUserLogin ? 'Admin' : 'User'}
                    </RedirectionText>
                  </RedirectionSection>
                </StyledLoginBox>
              </LoginBtnContainer>
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
                <LabelSelect>Version 2.1.10</LabelSelect>
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
                <LabelSelect>Version 2.1.10</LabelSelect>
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
