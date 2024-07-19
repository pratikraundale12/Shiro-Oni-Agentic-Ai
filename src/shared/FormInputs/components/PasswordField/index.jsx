import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TogglePassword from './components/TogglePassword';
import InputField from '../InputField';
import { BagIcon } from '../../../../assets';

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

const PasswordInputField = props => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = useCallback(
    () => setPasswordShown(prevState => !prevState),
    [setPasswordShown]
  );
  const label = props.label || 'Password';

  return (
    <Wrapper>
      <InputField
        type={passwordShown ? 'text' : 'password'}
        {...props}
        icon={<BagIcon />}
        label={label}
        placeholder="Enter Your Password"
      />
      <TogglePassword show={passwordShown} onToggle={togglePassword} />
    </Wrapper>
  );
};

PasswordInputField.propTypes = {
  label: PropTypes.string,
};

export default PasswordInputField;
