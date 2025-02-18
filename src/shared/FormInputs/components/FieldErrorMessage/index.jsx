import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';

const Errors = styled.div`
  margin-top: 2px;
  margin-left: 2px;
  color: ${props => props.theme.colors.error};
  font-weight: 500;
  font-size: 14px;
  position: absolute;
`;

const FieldErrorMessage = ({ errors, name, className }) => (
  <ErrorMessage
    errors={errors}
    name={name}
    render={({ message }) => <Errors className={className}>{message}</Errors>}
  />
);

FieldErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
};

export default FieldErrorMessage;
