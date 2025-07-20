import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import FieldErrorMessage from '../FieldErrorMessage';
import RadioField from '../RadioField';

const Label = styled.h3`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 0.5rem;
`;

export const RadioSelectField = ({
  label,
  register,
  name,
  options,
  errors = {},
  defaultValue,
  ...props
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
              register={register}
              defaultChecked={defaultValue === option.value ?? false}
              {...props}
            />
          </div>
        ))}
      </div>
      {!isEmpty(errors) && <FieldErrorMessage name={name} errors={errors} />}
    </>
  );
};

RadioSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errors: PropTypes.shape({}),
  defaultValue: PropTypes.any,
};

export default RadioSelectField;
