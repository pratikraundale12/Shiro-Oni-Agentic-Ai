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

const LoginForm = () => {
  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-start flex-column">
        <div className="d-flex align-items-center welcome-box">
          <div className="wave-emoji me-3" style={{ fontSize: '36px' }}>
            👋
          </div>
          <h1>Welcome back</h1>
        </div>
        <UnderLineIcon />
        <h2>Login to your account</h2>
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
              Forgot Password?
            </a>
          </div>
          <div className="btn-box d-flex justify-content-center align-items-center flex-column">
            <LoginButton
              className="signin-btn"
              text="Sign in to your Account"
              Icon={LessArrowIcon}
              iconProps={{ width: 8, color: 'white' }}
            />
            <small className="other-login-info">
              or do it via other accounts
            </small>
            <div className="login-opts d-flex justify-content-center align-items-center">
              <div className="d-flex align-items-center">
                <GoogleIcon />
                <span className="company-login">Google</span>
              </div>
              <div className="d-flex align-items-center">
                <MicroSoftIcon />
                <span className="company-login">Microsoft</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
