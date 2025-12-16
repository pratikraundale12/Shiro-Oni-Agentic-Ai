import React from 'react';
import { TextareaField } from '../../../shared';
import PropTypes from 'prop-types';

const AuthorizersXml = ({ register, errors, rows = 21 }) => {
  return (
    <div>
      <TextareaField
        label="Authorizers.xml"
        name="authorizers_xml"
        placeholder="Enter Authorizers XML"
        required
        register={register}
        errors={errors}
        rows={rows}
      />
    </div>
  );
};

export default AuthorizersXml;

AuthorizersXml.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  rows: PropTypes.number,
};
