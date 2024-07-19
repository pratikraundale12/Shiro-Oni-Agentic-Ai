import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../shared/FormInputs/components/InputField';
import LoginButton from '../../shared/Button/components/LoginButton';
import {
  GreaterArrowIcon,
  LessArrowIcon,
  MailIcon,
  UnderLineIcon,
} from '../../assets';

const ForgotForm = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSignInClick();
    }
  };

  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-start flex-column">
        <div className="d-flex justify-content-start align-items-center w-100">
          <span
            className="mb-3"
            onClick={handleSignInClick}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <GreaterArrowIcon />
          </span>
          <div className="back-opt mb-3">Back</div>
        </div>
        <UnderLineIcon />
        <h2 className="mb-2">Forgot Password?</h2>
        <p className="mt-0 forgot-info">
          Please enter your registered email Id. We will send you a link to
          reset your password.
        </p>
        <form action="#" className="w-100">
          <InputField
            type=""
            placeholder="Enter Your Email Address"
            name="email"
            id="email"
            icon={<MailIcon />}
            label="E-mail Address"
          />

          <div className="btn-box d-flex justify-content-center align-items-center flex-column">
            <LoginButton
              className="signin-btn"
              text="Sign in to your Account"
              Icon={LessArrowIcon}
              iconProps={{ width: 8, color: 'white' }}
            />
          </div>
        </form>
        <div className="existing-account">
          <p>
            Already have an Account?
            <span
              className="sign-in ms-2"
              onClick={handleSignInClick}
              onKeyPress={handleKeyPress}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotForm;
