import React from 'react'
import InputField from '../../shared/FormInputs/components/InputField'
import { GoogleIcon, MailIcon, MicroSoftIcon } from '../../assets'
import PasswordInputField from '../../shared/FormInputs/components/PasswordField'

const LoginForm = () => {
  return (
    <div className="left-box_form">
    <div className="d-flex align-items-center justify-content-start flex-column">
      <div className="d-flex align-items-center welcome-box">
        <div className="wave-emoji me-3" style={{fontSize:"36px"}}>👋</div>
        <h1>Welcome back</h1>
      </div>
      <svg
        className="img-fluid seperator"
        width={476}
        height={1}
        viewBox="0 0 476 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          opacity="0.2"
          x1="-4.37114e-08"
          y1="0.5"
          x2={476}
          y2="0.499958"
          stroke="black"
          strokeDasharray="5 5"
        />
      </svg>
      <h2>Login to your account</h2>
      <form action="#" className="w-100">
        <InputField
          type=""
          placeholder="Enter Your Email Address"
          name="email"
          id="email"
          icon={<MailIcon />}
          label="E-mail Address"
        />

        <PasswordInputField />
        <div className="d-flex flex-column">
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <div className="btn-box d-flex justify-content-center align-items-center flex-column">
          <button className="signin-btn disable">
            <span>Sign in to your Account</span>
            <span className="left-arrow">
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.1717 7.0007L0.221924 2.05093L1.63614 0.636719L8.0001 7.0007L1.63614 13.3646L0.221924 11.9504L5.1717 7.0007Z"
                  fill="white"
                />
              </svg>
            </span>
          </button>
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
  )
}

export default LoginForm