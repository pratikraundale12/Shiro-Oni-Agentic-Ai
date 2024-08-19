import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #ff7a00;
  }

  &:focus + span {
    box-shadow: 0 0 1px #ff7a00;
  }

  &:checked + span:before {
    transform: translateX(18px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e6ebf0;
  transition: 0.2s;

  border-radius: 34px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 2px;
    top: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Label = styled.span`
  margin-top: 2px;
  margin-left: 8px;
  width: 110px;
  font-size: 14px;
`;

const ToggleSwitch = ({ id, name, checked, onChange }) => (
  <>
    <Switch>
      <CheckboxInput id={id} checked={checked} onChange={onChange} />

      <Slider />
    </Switch>
    <Label>{`${name} ${checked ? 'Enabled' : 'Disabled'}`}</Label>
  </>
);

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
export default ToggleSwitch;
