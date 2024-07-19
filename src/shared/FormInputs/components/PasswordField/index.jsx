import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import TogglePassword from './components/TogglePassword';
import InputField from '../InputField';

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .eye-icon {
    position: absolute;
    right: 12px;
    top: 32px;
    cursor: pointer;
  }
`;

const PasswordInputField = props => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = useCallback(
    () => setPasswordShown(prevState => !prevState),
    [setPasswordShown]
  );

  return (
    <Wrapper>
      <InputField type={passwordShown ? 'text' : 'password'} {...props} />
      <TogglePassword show={passwordShown} onToggle={togglePassword} />
    </Wrapper>
  );
};

export default PasswordInputField;
