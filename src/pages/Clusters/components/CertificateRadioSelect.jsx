import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

const Label = styled.h3`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${props => props.theme.colors.darker};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
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

const FieldError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const RadioField = ({
  name,
  label,
  value,
  onChange = () => {},
  defaultChecked,
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Wrapper>
      <RadioInput
        type="radio"
        name={name}
        id={`${name}-${label}`}
        value={String(value)}
        onChange={handleChange}
        defaultChecked={defaultChecked}
      />
      <StyledLabel htmlFor={`${name}-${label}`}>{label}</StyledLabel>
    </Wrapper>
  );
};

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  defaultChecked: PropTypes.bool,
};

export const CertificateRadioSelect = ({
  label,
  name,
  options,
  errors = {},
  defaultValue,
  onChange,
}) => {
  return (
    <>
      <Label>{label}</Label>
      <div className="d-flex mb-2">
        {options.map(option => (
          <div key={option.label} className="mr-2">
            <RadioField
              name={name}
              label={option.label}
              value={option.value}
              onChange={onChange}
              defaultChecked={defaultValue === option.value}
            />
          </div>
        ))}
      </div>
      {!isEmpty(errors) && errors[name] && (
        <FieldError>{errors[name]}</FieldError>
      )}
    </>
  );
};

CertificateRadioSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
    })
  ).isRequired,
  errors: PropTypes.shape({}),
  defaultValue: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CertificateRadioSelect;
