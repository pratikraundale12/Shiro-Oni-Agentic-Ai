import React from 'react';
import PropTypes from 'prop-types';
import { CloseEyeIcon, OpenEyeIcon } from '../../../../../assets';

const TogglePassword = ({ show, onToggle, disabled = false }) => (
  <div
    className={`eye-icon ${disabled ? 'disabled' : ''}`}
    role="presentation"
    onClick={!disabled ? onToggle : null}
    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {show ? <OpenEyeIcon /> : <CloseEyeIcon />}
  </div>
);

TogglePassword.propTypes = {
  show: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TogglePassword;
