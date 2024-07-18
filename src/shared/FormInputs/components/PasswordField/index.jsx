import { useCallback, useState } from "react";
import styled from "styled-components";

import TogglePassword from "./components/TogglePassword";
import InputField from "../InputField";
import { BagIcon } from "../../../../assets";

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .eye-icon {
    position: absolute;
    right: 12px;
    top: 42px;
    cursor: pointer;
  }
`;

const PasswordInputField = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = useCallback(
    () => setPasswordShown((prevState) => !prevState),
    [setPasswordShown]
  );

  return (
    <Wrapper>
      <InputField
        type={passwordShown ? "text" : "password"}
        {...props}
        icon={<BagIcon />}
        label="Password"
        placeholder="Enter Your Paasword"
      />
      <TogglePassword show={passwordShown} onToggle={togglePassword} />
    </Wrapper>
  );
};

export default PasswordInputField;
