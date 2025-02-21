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
  position: ${props => (props.isFromUserStory ? 'absolute' : 'relative')};
`;

const FieldErrorMessage = ({
  errors,
  name,
  className,
  isFromUserStory = false,
}) => (
  <ErrorMessage
    errors={errors}
    name={name}
    render={({ message }) => (
      <Errors isFromUserStory={isFromUserStory} className={className}>
        {message}
      </Errors>
    )}
  />
);

FieldErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  isFromUserStory: PropTypes.bool,
};

export default FieldErrorMessage;
