import { isFunction } from "lodash";
import styled from "styled-components";
import classNames from "classnames";
import PropTypes from "prop-types";

import FieldErrorMessage from "../FieldErrorMessage";
import { hasError } from "../../../../utils";

const Container = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 1rem;

  svg {
    position: absolute;
    top: 32px;
    right: 10px;
    cursor: pointer;
  }

  .required {
    color: ${(props) => props.theme.colors.error};
    font-size: 1rem;
  }

  &.error {
    input {
      border-color: ${(props) => props.theme.colors.error} !important;
      outline: none;
    }
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 15.06px;
    margin-bottom: 5px;
  }

  input[type="checkbox"] {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }

  input:not([type="checkbox"]) {
    width: 100%;
    height: 42px;
    border: 1px solid ${(props) => props.theme.colors.borderGrey};
    border-radius: 4px;
    background: ${(props) => props.theme.colors.white};
    padding: 10px;
    font-size: 14px;

    &::placeholder {
      color: ${(props) => props.theme.colors.grey};
      font-size: 14px;
    }

    &:focus-visible {
      outline: none;
    }

    &:not(:placeholder-shown),
    &:focus {
      border: 1px solid ${(props) => props.theme.colors.primary};

      &::placeholder {
        color: transparent;
      }
    }
    &:disabled {
      background: ${(props) => props.theme.colors.lightGrey2};
    }
  }
`;

const InputField = ({
  name,
  register = null,
  errors = {},
  label,
  type = "text",
  required = false,
  disabled = false,
  registerOptions = {},
  className,
  ...props
}) => {
  const error = hasError(errors, name);

  return (
    <Container
      className={classNames({
        error,
        [className]: className,
      })}
    >
      {label && (
        <label>
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        aria-invalid={error}
        {...props}
        {...(isFunction(register) &&
          register(name, { required, ...registerOptions }))}
        disabled={disabled}
      />
      <FieldErrorMessage errors={errors} name={name} />
    </Container>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  errors: PropTypes.shape({}),
  required: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputField;
