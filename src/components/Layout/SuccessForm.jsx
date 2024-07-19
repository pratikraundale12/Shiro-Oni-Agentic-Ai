import React from "react";
import { ForgetPasswordSymbol, LessArrow, RightInCircle } from "../../assets";
import LoginButton from "../../shared/Button/components/LoginButton";
import { useNavigate } from "react-router-dom";

const SuccessForm = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login");
  };
  return (
    <div className="left-box_form">
      <div className="d-flex align-items-center justify-content-center flex-column h-100">
        <div>
          <RightInCircle width={90} height={90}/>
        </div>
        <div className="mb-4 pb-1">
          <ForgetPasswordSymbol />
        </div>
        <div className="password-updated">
          <h3 className="mb-2">Password Changed</h3>
          <p>Your password has been changed successfully</p>
        </div>
        <div className="btn-box d-flex justify-content-center align-items-center flex-column w-100">
        <LoginButton
              className="signin-btn"
              text="Back to Login"
              Icon={LessArrow}
              iconProps={{ width: 8, color: "white" }}
            />
        </div>
        <div className="existing-account">
          <p>
            Already have an Account?
            <span className="sign-in ms-2" onClick={handleSignInClick}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessForm;
