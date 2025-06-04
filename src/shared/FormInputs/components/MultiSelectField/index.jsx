/* eslint-disable react/prop-types */
import classNames from 'classnames';
import { get, isEmpty, isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import styled, { useTheme } from 'styled-components';
import CheckboxField from '../CheckboxField';

const Container = styled.div`
  position: relative;

  path {
    fill: ${props => props.theme.colors.grey};
  }

  .error {
    color: ${props => props.theme.colors.error};
    font-weight: 600;
    font-size: 12px;
    margin-left: 1.1rem;
  }

  .label {
    position: absolute;
    z-index: 1;
    transform: translateY(-50%);
    left: 0.75rem;
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.darkGrey};
    font-weight: 600;
    pointer-events: none;
    font-size: 0.75rem;
    padding: 0 0.375rem;
  }
`;

const CustomOptionContainer = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.shadow};
`;

const validateAndGetArray = arr =>
  Array.isArray(arr) &&
  arr.every(
    item => typeof item === 'object' && 'label' in item && 'value' in item
  )
    ? arr
    : [];

const CustomOption = ({ children, isSelected, innerProps }) => (
  <CustomOptionContainer>
    <CheckboxField checked={isSelected} label={children} {...innerProps} />
  </CustomOptionContainer>
);

const MultiSelectField = ({
  control,
  name,
  placeholder,
  options,
  errors,
  label,
  required,
  wrapperCustomClass,
  disabled,
  enableCheckboxes,
  registerOption,
  customOnChange,
  customValue,
  customWidth,
  ...props
}) => {
  const theme = useTheme();

  const errorMessages = get(errors, name);
  const hasError = !isEmpty(errorMessages);

  const customStyles = {
    indicatorSeparator: () => ({ display: 'none' }),
    control: (styles, state) => {
      const newStyles = {
        ...styles,
        minHeight: 42,
        width: customWidth || '100%',
      };

      if (state.isFocused) newStyles.borderColor = theme.colors.darkGrey;
      else if (hasError) newStyles.borderColor = theme.colors.error;
      else newStyles.borderColor = theme.colors.grey;

      return newStyles;
    },
    placeholder: provided => ({ ...provided, color: theme.colors.grey }),
    menuPortal: provided => ({
      ...provided,
      zIndex: 10,
    }),

    multiValueRemove: provided => ({
      ...provided,
      minWidth: 'fit-content',
      cursor: 'pointer',
      svg: {
        width: '12px',
        height: '12px',
      },
    }),
    option: provided => ({
      ...provided,
      color: theme.colors.darkGrey,
    }),
  };

  const commonProps = {
    isMulti: true,
    isSearchable: true,
    isClearable: true,
    isDisabled: disabled,
    styles: customStyles,
    inputRef: null,
    placeholder,
    options,
    value: null,
    onChange: null,
    theme: theme.reactSelecttheme,
    menuPortalTarget: typeof document !== 'undefined' && document.body,
    menuPosition: 'fixed',
    ...props,
  };

  return (
    <Container
      className={classNames({ [wrapperCustomClass]: !!wrapperCustomClass })}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, ref, value } }) => {
          let data = validateAndGetArray(customValue || value);
          if (
            registerOption?.sortValues &&
            typeof registerOption.sortValues === 'function'
          ) {
            data = registerOption.sortValues(data);
          }
          const selectProps = {
            ...commonProps,
            inputRef: ref,
            value: data,
            onChange: (...args) =>
              isFunction(customOnChange)
                ? customOnChange(onChange, ...args)
                : onChange(...args),
          };

          const SelectComponent = enableCheckboxes ? (
            <Select
              {...selectProps}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              components={{
                Option: CustomOption,
              }}
            />
          ) : (
            <Select {...selectProps} />
          );

          return (
            <>
              {label && !isEmpty(data) && (
                <span className="label line-height-110">
                  {label}
                  {required && <span className="required">&nbsp;*</span>}
                </span>
              )}
              {SelectComponent}
              {/* <FieldErrorMessage errors={errors} name={name} /> */}
            </>
          );
        }}
      />
    </Container>
  );
};

MultiSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errors: PropTypes.shape({}),
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  wrapperCustomClass: PropTypes.string,
  enableCheckboxes: PropTypes.bool,
  customWidth: PropTypes.string,
};

MultiSelectField.defaultProps = {
  errors: {},
  label: '',
  required: false,
  wrapperCustomClass: null,
  disabled: false,
  enableCheckboxes: false,
  customWidth: '',
};

export default MultiSelectField;
