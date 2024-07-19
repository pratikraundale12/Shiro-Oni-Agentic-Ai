import React from 'react';
import InputField from '../../shared/FormInputs/components/InputField';
import {
  GoogleIcon,
  LessArrowIcon,
  MailIcon,
  MicroSoftIcon,
  RightArrowIcon,
  UnderLineIcon,
} from '../../assets';
import PasswordInputField from '../../shared/FormInputs/components/PasswordField';
import LoginButton from '../../shared/Button/components/LoginButton';
import { LOGINPAGES } from '../../utils/constants/Login';

const LoginForm = () => {
  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-start flex-column">
        <div className="d-flex align-items-center welcome-box">
          <div className="wave-emoji me-3" style={{ fontSize: '36px' }}>
            👋
          </div>
          <h1>{LOGINPAGES.WELCOME_BACK}</h1>
        </div>
        <UnderLineIcon />
        <h2>{LOGINPAGES.LOGIN_TO_YOUR_ACCOUNT}</h2>
        <form action="#" className="w-100">
          <InputField
            type=""
            placeholder="Enter Your Email Address"
            name="email"
            id="email"
            icon={<MailIcon />}
            label="E-mail Address"
            checkicon={<RightArrowIcon color="#E32235" />}
          />

          <PasswordInputField />
          <div className="d-flex flex-column">
            <a href="/forgot" className="forgot-password">
              {LOGINPAGES.FORGOT_PASSWORD}
            </a>
          </div>
          <div className="btn-box d-flex justify-content-center align-items-center flex-column">
            <LoginButton
              className="signin-btn"
              text={LOGINPAGES.SIGN_IN}
              Icon={LessArrowIcon}
              iconProps={{ width: 8, color: 'white' }}
            />
            <small className="other-login-info">
              {LOGINPAGES.OTHER_ACCOUNT}
            </small>
            <div className="login-opts d-flex justify-content-center align-items-center">
              <div className="d-flex align-items-center">
                <GoogleIcon />
                <span className="company-login">{LOGINPAGES.GOOGLE}</span>
              </div>
              <div className="d-flex align-items-center">
                <MicroSoftIcon />
                <span className="company-login">{LOGINPAGES.MICROSOFT}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
