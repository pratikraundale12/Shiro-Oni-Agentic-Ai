import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const StyledLabel = styled.label`
  color: ${props => props.theme.colors.darker};
  font-size: 14px;
  margin-top: 2px;
  margin-left: 8px;
  cursor: pointer;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  width: 16px;
  height: 16px;
  margin: 0;
  margin-right: 5px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  border-radius: 50%;
  position: relative;

  &:checked {
    background-color: ${props => props.theme.colors.primaryActive};
    border-color: transparent;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.9997 10.1709L16.1921 0.978516L17.6063 2.39273L6.9997 12.9993L0.635742 6.6354L2.04996 5.2212L6.9997 10.1709Z" fill="white"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transform: translate(-50%, -50%);
    }

    &:disabled {
      background-color: ${props => props.theme.colors.primaryDisabled};
      cursor: not-allowed;
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const RadioField = ({ name, register, label, refName = null, ...props }) => {
  return (
    <Wrapper ref={refName}>
      <RadioInput
        type="radio"
        name={name}
        id={label}
        {...register(name)}
        {...props}
        // {...(typeof register === 'function' && register(name))}
      />
      <StyledLabel htmlFor={label}>{label}</StyledLabel>
    </Wrapper>
  );
};

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  refName: PropTypes.string,
};

export default RadioField;
