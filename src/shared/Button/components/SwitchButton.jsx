import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
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
    transform: translateX(15px);
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
  transition: 0.4s;

  border-radius: 34px;

  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    top: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ToggleSwitch = ({ id, checked, onChange }) => (
  <Switch>
    <CheckboxInput id={id} checked={checked} onChange={onChange} />

    <Slider />
  </Switch>
);

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
export default ToggleSwitch;
