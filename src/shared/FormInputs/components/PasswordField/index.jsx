import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TogglePassword from './components/TogglePassword';
import InputField from '../InputField';
import { BagIcon } from '../../../../assets';
import { hasError } from '../../../../helpers';

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  > div {
    margin-bottom: 0.4rem;
  }

  .eye-icon {
    cursor: pointer;
  }
`;

const StrengthMeter = styled.div`
  height: 5px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  background: ${props => props.theme.colors.lightGrey};
`;

const Indicator = styled.div`
  width: 20%;
  margin-right: 5px;
  background-color: ${props => props.color};
`;

const HelperText = styled.div`
  font-size: 10px;
  line-height: 15px;
  margin-top: 5px;
  color: ${props => props.theme.colors.darker};
`;

const getStrengthColor = score => {
  switch (score) {
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'yellow';
    case 4:
      return 'lightgreen';
    case 5:
      return 'green';
    default:
      return 'transparent';
  }
};

const calculateStrength = password => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const PasswordInputField = ({
  name,
  errors,
  watch,
  helperText = '',
  showStrengthMeter = false,
  icon = <BagIcon />,
  ...props
}) => {
  const error = hasError(errors, name);
  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState(0);
  const value = watch(name);

  const togglePassword = useCallback(
    () => setShow(prevState => !prevState),
    []
  );

  const onChange = event => {
    const { value } = event.target;
    setStrength(calculateStrength(value));
  };

  return (
    <Wrapper>
      <InputField
        name={name}
        type={show ? 'text' : 'password'}
        {...props}
        icon={icon}
        placeholder="Enter Your Password"
        rightIcon={<TogglePassword show={show} onToggle={togglePassword} />}
        registerOptions={{
          onChange,
        }}
        errors={errors}
      />
      {!error && helperText && <HelperText>{helperText}</HelperText>}
      {showStrengthMeter && value && (
        <StrengthMeter>
          {[1, 2, 3, 4, 5].map(index => (
            <Indicator
              key={index}
              color={index <= strength && getStrengthColor(strength)}
            />
          ))}
        </StrengthMeter>
      )}
    </Wrapper>
  );
};

PasswordInputField.propTypes = {
  name: PropTypes.string.isRequired,
  watch: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  helperText: PropTypes.string,
  showStrengthMeter: PropTypes.boolean,
  icon: PropTypes.func,
};

export default PasswordInputField;
