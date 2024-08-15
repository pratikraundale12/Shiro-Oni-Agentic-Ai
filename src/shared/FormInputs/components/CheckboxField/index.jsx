import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  label {
    color: ${props => props.theme.colors.darker};
    font-size: 14px;
    margin-left: 8px;
  }
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxField = ({
  name,
  register,
  label,
  className = null,
  ...props
}) => (
  <Wrapper className={className}>
    <CheckboxInput
      id={label?.toLowerCase()}
      type="checkbox"
      name={name}
      {...props}
      {...(typeof register === 'function' && register(name))}
    />
    {label && <label htmlFor={label?.toLowerCase()}>{label}</label>}
  </Wrapper>
);

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default CheckboxField;
