/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';
import styled, { useTheme } from 'styled-components';
import CheckboxField from '../CheckboxField';
import classNames from 'classnames';
import { get, isEmpty, isFunction } from 'lodash';
import PropTypes from 'prop-types';

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
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.darker};
`;

const SelectAllOptionContainer = styled.div`
  padding: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.darkGrey};
  font-weight: 700;
  font-size: 14px;
  color: ${props => props.theme.colors.darker};
  background-color: ${props => props.theme.colors.lightGrey || '#f8f9fa'};
`;

const CustomOption = ({ children, isSelected, innerProps, data }) => {
  // Check if this is the "Select All" option
  if (data?.isSelectAll) {
    return (
      <SelectAllOptionContainer>
        <CheckboxField checked={isSelected} label={children} {...innerProps} />
      </SelectAllOptionContainer>
    );
  }

  return (
    <CustomOptionContainer>
      <CheckboxField checked={isSelected} label={children} {...innerProps} />
    </CustomOptionContainer>
  );
};

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

// ✅ Custom Control with stable menu toggle
const CustomControl = props => {
  const { children, innerRef, innerProps, selectProps } = props;

  return (
    <components.Control
      {...props}
      innerRef={innerRef}
      innerProps={{
        ...innerProps,
        onMouseDown: e => {
          e.preventDefault(); // Prevent blur and default close
          selectProps.setMenuIsOpen(prev => !prev); // Toggle open/close
        },
      }}
    >
      {children}
    </components.Control>
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
  enableSelectAll = false, // New prop to enable/disable select all
  selectAllLabel = 'Select All', // Customizable select all label
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

  // Create select all option
  const selectAllOption = {
    label: selectAllLabel,
    value: '__select_all__',
    isSelectAll: true,
  };

  // Add select all option to the beginning if enabled
  const enhancedOptions = enableSelectAll
    ? [selectAllOption, ...options]
    : options;

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

  // const commonProps = {
  //   isMulti: true,
  //   isSearchable: true,
  //   isClearable: true,
  //   isDisabled: disabled,
  //   styles: customStyles,
  //   inputRef: null,
  //   placeholder,
  //   options,
  //   value: null,
  //   onChange: null,
  //   theme: theme.reactSelecttheme,
  //   menuPortalTarget: typeof document !== 'undefined' && document.body,
  //   menuPosition: 'fixed',
  //   ...props,
  // };

  // ✅ Close dropdown on outside click
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

  // Handle select all logic
  const handleSelectAllChange = (onChange, selectedValues, actionMeta) => {
    if (!enableSelectAll) {
      // If select all is disabled, use normal behavior
      return isFunction(customOnChange)
        ? customOnChange(onChange, selectedValues, actionMeta)
        : onChange(selectedValues, actionMeta);
    }

    const isSelectAllClicked = actionMeta.option?.isSelectAll;
    const regularOptions = options.filter(option => !option.isSelectAll);

    if (isSelectAllClicked) {
      // If "Select All" was clicked
      const currentRegularValues = selectedValues.filter(
        val => !val.isSelectAll
      );
      const areAllSelected =
        currentRegularValues.length === regularOptions.length;

      if (areAllSelected) {
        // If all are selected, deselect all
        const result = isFunction(customOnChange)
          ? customOnChange(onChange, [], actionMeta)
          : onChange([], actionMeta);
        return result;
      } else {
        // If not all are selected, select all
        const result = isFunction(customOnChange)
          ? customOnChange(onChange, regularOptions, actionMeta)
          : onChange(regularOptions, actionMeta);
        return result;
      }
    } else {
      // Normal option was clicked, filter out select all option
      const filteredValues = selectedValues.filter(val => !val.isSelectAll);
      const result = isFunction(customOnChange)
        ? customOnChange(onChange, filteredValues, actionMeta)
        : onChange(filteredValues, actionMeta);
      return result;
    }
  };

  // Check if all options are selected (for checkbox state)
  const isAllSelected = currentValue => {
    if (!enableSelectAll) return false;
    const regularOptions = options.filter(option => !option.isSelectAll);
    const currentRegularValues = currentValue.filter(val => !val.isSelectAll);
    return (
      regularOptions.length > 0 &&
      currentRegularValues.length === regularOptions.length
    );
  };

  // ✅ Close dropdown on outside click
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
          // const selectProps = {
          //   ...commonProps,
          //   inputRef: ref,
          //   value: data,
          //   onChange: (...args) =>
          //     isFunction(customOnChange)
          //       ? customOnChange(onChange, ...args)
          //       : onChange(...args),
          // };

          // const SelectComponent = enableCheckboxes ? (
          //   <Select
          //     {...selectProps}
          //     hideSelectedOptions={false}
          //     closeMenuOnSelect={false}
          //     components={{
          //       Option: CustomOption,
          //     }}
          //   />
          // ) : (
          //   <Select {...selectProps} />
          // );

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
                onChange={(selectedValues, actionMeta) =>
                  handleSelectAllChange(onChange, selectedValues, actionMeta)
                }
                options={enhancedOptions}
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
                components={{
                  Control: CustomControl,
                  ValueContainer: CustomValueContainer,
                  Option: enableCheckboxes
                    ? props => (
                        <CustomOption
                          {...props}
                          isSelected={
                            props.data?.isSelectAll
                              ? isAllSelected(data)
                              : props.isSelected
                          }
                        />
                      )
                    : undefined,
                }}
                setMenuIsOpen={setMenuIsOpen} // 👈 Pass to custom Control
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
