import React from "react";
import { GreaterArrow, LessArrow, UnderLineIcon } from "../../assets";
import PasswordInputField from "../../shared/FormInputs/components/PasswordField";
import { useNavigate } from "react-router-dom";
import LoginButton from "../../shared/Button/components/LoginButton";

const ResetForm = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login");
  };
  const handleArrowClick = () => {
    navigate("/forgot");
  };

  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-start flex-column">
        <div className="d-flex justify-content-start align-items-center w-100">
          <span
            className="mb-3"
            onClick={handleArrowClick}
            style={{ cursor: "pointer" }}
          >
            <GreaterArrow />
          </span>
          <div className="back-opt mb-3">Back</div>
        </div>
        <UnderLineIcon />
        <h2 className="mb-2">Reset your Password</h2>
        <p className="mt-0 forgot-info mb-40 w-100">
          Enter your new Password to Reset.
        </p>
        <form action="#" className="w-100">
          <PasswordInputField label="New Password" />
          <div className="password-length">
         <div className="d-flex align-items-center justify-content-between">
         <small className="password-strength-text mb-2">
            Make sure your new password strong and secure
          </small>
          <span>Weak</span>
         </div>
          <div className="row me-0">
            <div className="col-2 pe-0">
              <div className="strendth-fill weak" />
            </div>
            <div className="col-2 px-1">
              <div className="strendth-fill weak" />
            </div>
            <div className="col-2 px-1">
              <div className="strendth-fill weak" />
            </div>
            <div className="col-2 px-1">
              <div className="strendth-fill" />
            </div>
            <div className="col-2 px-1">
              <div className="strendth-fill" />
            </div>
            <div className="col-2 px-1">
              <div className="strendth-fill" />
            </div>
          </div>
          </div>
          <PasswordInputField label="Confirm New Password" />

          <div className="mb-42 btn-box d-flex justify-content-center align-items-center flex-column">
            <LoginButton
              className="signin-btn"
              text="Sign in to your Account"
              Icon={LessArrow}
              iconProps={{ width: 8, color: "white" }}
            />
          </div>
        </form>
        <div className="existing-account">
          <p>
            Already have an Account?
            <span className="sign-in ms-2" onClick={handleSignInClick}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
