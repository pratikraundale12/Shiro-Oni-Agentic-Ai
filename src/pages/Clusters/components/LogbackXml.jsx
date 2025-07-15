import React from 'react';
import { TextareaField } from '../../../shared';
import PropTypes from 'prop-types';

const LogbackXml = ({ register, errors, rows = 21 }) => {
  return (
    <div>
      <TextareaField
        label="Logback.xml"
        name="logback_xml"
        placeholder="Enter Logback XML"
        required
        register={register}
        errors={errors}
        rows={rows}
      />
    </div>
  );
};

export default LogbackXml;

LogbackXml.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  rows: PropTypes.number,
};
