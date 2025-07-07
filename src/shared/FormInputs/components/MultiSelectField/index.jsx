/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';
import styled, { useTheme } from 'styled-components';
import CheckboxField from '../CheckboxField';
import classNames from 'classnames';
import { get, isEmpty, isFunction } from 'lodash';

const Container = styled.div`
  position: relative;

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
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.darker};
`;

const CustomOption = ({ children, isSelected, innerProps }) => (
  <CustomOptionContainer>
    <CheckboxField checked={isSelected} label={children} {...innerProps} />
  </CustomOptionContainer>
);

const CustomValueContainer = ({ getValue, hasValue, ...props }) => {
  const selected = getValue();
  const count = selected.length;

  return (
    <components.ValueContainer {...props}>
      {hasValue
        ? `${count} item${count > 1 ? 's' : ''} selected`
        : props.selectProps.placeholder}
    </components.ValueContainer>
  );
};

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
  const containerRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const validateAndGetArray = arr =>
    Array.isArray(arr) &&
    arr.every(
      item => typeof item === 'object' && 'label' in item && 'value' in item
    )
      ? arr
      : [];

  const customStyles = {
    indicatorSeparator: () => ({ display: 'none' }),
    control: (styles, state) => ({
      ...styles,
      minHeight: 42,
      width: customWidth || '100%',
      borderColor: state.isFocused
        ? theme.colors.darkGrey
        : hasError
          ? theme.colors.error
          : theme.colors.grey,
      boxShadow: 'none',
    }),
    placeholder: provided => ({ ...provided, color: theme.colors.grey }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    multiValue: base => ({ ...base, display: 'none' }),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      className={classNames({ [wrapperCustomClass]: !!wrapperCustomClass })}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref } }) => {
          let data = validateAndGetArray(customValue || value);

          if (
            registerOption?.sortValues &&
            typeof registerOption.sortValues === 'function'
          ) {
            data = registerOption.sortValues(data);
          }

          return (
            <>
              {label && !isEmpty(data) && (
                <span className="label">
                  {label} {required && <span className="required">*</span>}
                </span>
              )}
              <Select
                ref={ref}
                value={data}
                onChange={(...args) =>
                  isFunction(customOnChange)
                    ? customOnChange(onChange, ...args)
                    : onChange(...args)
                }
                options={options}
                isMulti
                isSearchable
                isClearable
                isDisabled={disabled}
                placeholder={placeholder}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                styles={customStyles}
                menuPortalTarget={
                  typeof document !== 'undefined' && document.body
                }
                menuPosition="absolute"
                menuShouldBlockScroll={false}
                blurInputOnSelect={false}
                menuIsOpen={menuIsOpen}
                onMenuOpen={() => setMenuIsOpen(true)}
                onMenuClose={() => setMenuIsOpen(false)}
                onFocus={() => setMenuIsOpen(true)} // 👈 Open on focus
                onClick={() => setMenuIsOpen(true)} // 👈 Open on click anywhere
                components={{
                  ValueContainer: CustomValueContainer,
                  Option: enableCheckboxes ? CustomOption : undefined,
                }}
                {...props}
              />
              {hasError && (
                <span className="error">{errorMessages.message}</span>
              )}
            </>
          );
        }}
      />
    </Container>
  );
};

export default MultiSelectField;
