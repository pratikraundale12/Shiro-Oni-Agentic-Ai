import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import makeAnimated from 'react-select/animated';

import FieldErrorMessage from '../FieldErrorMessage';
import { DownArrowIcon } from '../../../../assets';
import { theme } from '../../../../styles';
import { hasError } from '../../../../helpers';

const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }
`;

const DropdownIndicator = props =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {props.selectProps.icon && (
        <span
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            padding: 14,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: theme.colors.lightGrey,
          }}
        >
          {props.selectProps.icon}
        </span>
      )}
      <DownArrowIcon />
    </components.DropdownIndicator>
  );

DropdownIndicator.propTypes = {
  selectProps: PropTypes.shape({
    icon: PropTypes.node,
  }).isRequired,
};

const SelectField = ({
  name = '',
  label = '',
  control = {},
  errors = {},
  options = [],
  size = 'md',
  disabled = false,
  required = false,
  className = '',
  placeholder = 'Select...',
  backgroundColor,
  title = '',
  isClearable = false,
  ...props
}) => {
  const animatedComponents = makeAnimated();
  const error = hasError(errors, name);

  const getBorderColor = ({ isFocused }) => {
    if (isFocused && !error) return theme.colors.darker;
    if (error) return theme.colors.error;
    return theme.colors.border;
  };

  const customStyles = {
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: styles => ({
      ...styles,
      ...(size === 'sm' && {
        svg: {
          width: 12,
          height: 12,
        },
      }),
    }),
    dropdownIndicator: styles => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
    }),
    clearIndicator: styles => ({
      ...styles,
      position: 'absolute',
      right: 0,
    }),
    menu: styles => ({
      ...styles,
      zIndex: 99,
    }),
    menuList: styles => ({
      ...styles,
      padding: 0,
    }),
    placeholder: styles => ({
      ...styles,
      fontSize: 14,
      color: theme.colors.darker,
      fontFamily: theme.fontNato,
    }),
    container: styles => ({
      ...styles,
      marginTop: label ? 10 : 0,
    }),
    control: (styles, state) => ({
      ...styles,
      padding: size === 'sm' ? 2 : '8px 4px',
      paddingLeft: props.icon ? 44 : 4,
      minHeight: 0,
      minWidth: 'max-content',
      boxShadow: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderColor: getBorderColor(state),
      backgroundColor: disabled
        ? theme.colors.lightGrey2
        : backgroundColor || theme.colors.white,
      '&:hover': {
        borderColor: theme.colors.darker,
      },
      'svg path': {
        fill: theme.colors.darker,
      },
    }),
    option: (styles, state) => ({
      ...styles,
      fontWeight: 500,
      fontFamily: theme.fontNato,
      backgroundColor: state.isFocused
        ? theme.colors.lightGrey1
        : state.isSelected
          ? theme.colors.lightGrey1
          : 'transparent',
      color: state.isSelected && theme.colors.darker,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    singleValue: styles => ({
      ...styles,
      fontFamily: theme.fontNato,
      fontWeight: 500,
      fontSize: 14,
    }),
    valueContainer: styles => ({
      ...styles,
    }),
  };

  if (isEmpty(control)) {
    return (
      <Container className={className} title={title}>
        <Select
          isClearable={isClearable}
          classNamePrefix="react-select"
          theme={theme.reactSelecttheme}
          isDisabled={disabled}
          styles={customStyles}
          options={options}
          components={{
            ...animatedComponents,
            IndicatorSeparator: () => null,
            DropdownIndicator,
          }}
          {...props}
        />
      </Container>
    );
  }

  return (
    <Container className={className} title={title}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref } }) => (
          <>
            {label && (
              <label>
                {label}
                {required && <span className="required">&nbsp;*</span>}
              </label>
            )}
            <Select
              ref={ref}
              isClearable={isClearable}
              classNamePrefix="react-select"
              value={options.find(option => option.value === value)}
              placeholder={placeholder}
              theme={theme.reactSelecttheme}
              isDisabled={disabled}
              styles={customStyles}
              options={options}
              components={{
                ...animatedComponents,
                IndicatorSeparator: () => null,
                DropdownIndicator,
              }}
              // formatOptionLabel={formatOptionLabel}
              {...props}
              onChange={option => {
                if (props.onChange) props.onChange(option);
                onChange(option?.value);
              }}
            />
            <FieldErrorMessage errors={errors} name={name} />
          </>
        )}
      />
    </Container>
  );
};

SelectField.propTypes = {
  name: PropTypes.string,
  control: PropTypes.shape({}),
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errors: PropTypes.shape({}),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.node,
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  isClearable: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SelectField;
