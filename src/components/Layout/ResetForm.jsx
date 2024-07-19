import React from 'react';
import { GreaterArrowIcon, LessArrowIcon, UnderLineIcon } from '../../assets';
import PasswordInputField from '../../shared/FormInputs/components/PasswordField';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../../shared/Button/components/LoginButton';
import { LOGINPAGES } from '../../utils/constants/Login';

const ResetForm = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleArrowClick = () => {
    navigate('/forgot');
  };

  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-start flex-column">
        <div className="d-flex justify-content-start align-items-center w-100">
          <span
            className="mb-3"
            onClick={handleArrowClick}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleArrowClick();
              }
            }}
          >
            <GreaterArrowIcon />
          </span>
          <div className="back-opt mb-3">{LOGINPAGES.BACK}</div>
        </div>
        <UnderLineIcon />
        <h2 className="mb-2">{LOGINPAGES.RESET_YOUR_PASSWORD}</h2>
        <p className="mt-0 forgot-info mb-40 w-100">
          {LOGINPAGES.RESET_MESSAGE}
        </p>
        <form action="#" className="w-100">
          <PasswordInputField label="New Password" />
          <div className="password-length">
            <div className="d-flex align-items-center justify-content-between">
              <small className="password-strength-text mb-2">
                Make sure your new password is strong and secure
              </small>
              <span>Weak</span>
            </div>
            <div className="row me-0">
              <div className="col-2 pe-0">
                <div className="strength-fill weak" />
              </div>
              <div className="col-2 px-1">
                <div className="strength-fill weak" />
              </div>
              <div className="col-2 px-1">
                <div className="strength-fill weak" />
              </div>
              <div className="col-2 px-1">
                <div className="strength-fill" />
              </div>
              <div className="col-2 px-1">
                <div className="strength-fill" />
              </div>
              <div className="col-2 px-1">
                <div className="strength-fill" />
              </div>
            </div>
          </div>
          <PasswordInputField label="Confirm New Password" />
          <div className="mb-42 btn-box d-flex justify-content-center align-items-center flex-column">
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
            {LOGINPAGES.ALREADY_ACCOUNT}
            <span
              className="sign-in ms-2"
              onClick={handleSignInClick}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleSignInClick();
                }
              }}
            >
              {LOGINPAGES.SIGN}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
