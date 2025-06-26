import React from 'react';
import { TextareaField } from '../../../shared';
import PropTypes from 'prop-types';

const BootstrapConfig = ({ register, errors, rows = 21 }) => {
  return (
    <div>
      <TextareaField
        label="Bootstrap Configuration"
        name="bootstrap_config"
        placeholder="Enter Bootstrap Configuration"
        required
        register={register}
        errors={errors}
        rows={rows}
      />
    </div>
  );
};

export default BootstrapConfig;

BootstrapConfig.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  rows: PropTypes.number,
};
