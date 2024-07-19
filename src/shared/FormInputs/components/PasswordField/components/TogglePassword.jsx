import React from 'react';
import PropTypes from 'prop-types';
import { CloseEyeIcon, OpenEyeIcon } from '../../../../../assets';

const TogglePassword = ({ show, onToggle }) => (
  <div className="eye-icon">
    <span role="presentation" onClick={onToggle}>
      {show ? <OpenEyeIcon /> : <CloseEyeIcon />}
    </span>
  </div>
);

TogglePassword.propTypes = {
  show: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default TogglePassword;
